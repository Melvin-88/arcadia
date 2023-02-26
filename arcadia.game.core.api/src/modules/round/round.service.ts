/* eslint-disable max-lines */
import {
  EntityManager,
  GroupEntity,
  MachineEntity,
  OperatorEntity,
  PlayerEntity,
  PlayerRepository,
  QueueEntity,
  RoundEntity,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionEntity,
  SessionRepository,
  VoucherEntity,
} from 'arcadia-dal';
import { toCash } from '../../util/toCash';
import { BalanceNotifier } from '../balance.notifier/balance.notifier';
import { BusEventType } from '../event.bus/bus.event.type';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { AppLogger } from '../logger/logger.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { BetData } from '../operator.api.client/dto/betData';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { NotificationType } from '../player.client/notification.type';
import { PlayerClientService } from '../player.client/player.client.service';
import { RngHelper } from '../rng.service.client/rng.helper';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { RoundContext } from './round.context';

export class RoundService {
  private readonly roundRepo: RoundRepository;
  private readonly sessionRepo: SessionRepository;
  private readonly playerRepo: PlayerRepository;

  private readonly session: SessionEntity;
  private readonly queue: QueueEntity;
  private readonly machine: MachineEntity;
  private readonly player: PlayerEntity;
  private readonly group: GroupEntity;
  private readonly operator: OperatorEntity;
  private readonly voucher: VoucherEntity;
  private readonly correlationId: string;
  private readonly isAutoplayRound;

  constructor(private readonly logger: AppLogger,
              private readonly eventBusPublisher: EventBusPublisher,
              private readonly rngHelper: RngHelper,
              private readonly operatorClient: OperatorApiClientService,
              roundRepo: RoundRepository,
              sessionRepo: SessionRepository,
              playerRepo: PlayerRepository,
              private readonly playerPublisher: PlayerClientService,
              private readonly balanceNotifier: BalanceNotifier,
              private readonly monitoringService: MonitoringWorkerClientService,
              private readonly tokenManager: SessionDataManager,
              context: RoundContext,
              manager?: EntityManager) {
    if (manager) {
      this.sessionRepo = manager.getCustomRepository(SessionRepository);
      this.roundRepo = manager.getCustomRepository(RoundRepository);
      this.playerRepo = manager.getCustomRepository(PlayerRepository);
    } else {
      this.sessionRepo = sessionRepo;
      this.roundRepo = roundRepo;
      this.playerRepo = playerRepo;
    }
    this.session = context.session;
    this.queue = context.queue;
    this.operator = context.operator;
    this.player = context.player;
    this.group = context.group;
    this.machine = context.machine;
    this.isAutoplayRound = context.isAutoplayRound;
    this.voucher = context.voucher;
    this.correlationId = context.correlationId;
  }

  public async startRound(type: RoundType): Promise<RoundEntity> {
    const {
      bet, rtp, deductRound, countToLimit,
    } = this.getRoundOptions(type);
    const betInCash = toCash(bet, this.session.currencyConversionRate);
    const round = await this.createRound(type, bet, betInCash, rtp);
    let result: BetData;
    try {
      result = await this.bet(betInCash, round.id);
    } catch (err) {
      await this.roundRepo.delete(round.id);
      this.logger.error(err.message, err.stack);
      throw err;
    }
    const { transactionId, balance } = result;
    await this.tokenManager.setRoundTransactionId(round.id, transactionId);
    this.playerPublisher.notifyBalance(this.session.id, { valueInCash: balance });
    this.monitoringService.sendEventLogMessage({
      eventType: EventType.BET,
      source: EventSource.GAME,
      params: {
        sum: betInCash,
        sessionId: this.session.id,
        machineSerial: this.machine.serial,
        currency: this.session.currency,
        transactionId,
      },
    });

    await this.sessionRepo.countNewRound(this.session.id, bet, betInCash, deductRound, countToLimit);
    await this.playerRepo.countBet(this.player.cid, bet);
    if (this.group.blueRibbonGameId && round.type !== RoundType.SCATTER) {
      this.eventBusPublisher.sendJackpotContribute({
        type: BusEventType.JACKPOT_CONTRIBUTE,
        session: this.session,
        player: this.player,
        group: this.group,
        operator: this.operator,
        machine: this.machine,
        round,
      }, this.correlationId);
    }
    await this.onRoundStarted(round);
    return round;
  }

  private async onRoundStarted(round: RoundEntity): Promise<void> {
    if (round.type !== RoundType.BET_BEHIND) {
      await this.notifyBetBehindRoundStart();
      this.playerPublisher.broadcastRemainingCoins(this.machine.serial, round.coins);
    }
    this.playerPublisher.notifyRoundStart(this.session.id, round.type);
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.START_ROUND,
      source: EventSource.GAME,
      params: {
        sessionId: this.session.id,
        machineSerial: this.machine.serial,
      },
    });
  }

  private async notifyBetBehindRoundStart() {
    const sessions = await this.sessionRepo.getBetBehindersFromQueue(this.queue.id);
    sessions.forEach(session => this.eventBusPublisher
      .sendEvent({
        sessionId: session.id,
        type: BusEventType.BET_BEHIND_ROUND_START,
      }, this.correlationId));
  }

  private async createRound(
    type: RoundType, bet: number, betInCash: number, rtp = true,
    status = RoundStatus.ACTIVE,
  ): Promise<RoundEntity> {
    const rtpSeed = rtp ? await this.rngHelper.calcRtp(this.group, this.machine, this.session.configuration) : null;
    const round = this.roundRepo.create({
      type,
      status,
      coins: this.group.stackSize,
      bet,
      betInCash,
      session: this.session,
      rtp: rtpSeed,
      machineId: this.machine.id,
      isAutoplay: this.isAutoplayRound,
      voucherId: this.voucher?.id,
    });
    return this.roundRepo.save(round);
  }

  private async bet(bet: number, roundId: number): Promise<BetData> {
    const sessionToken = await this.tokenManager.getSessionToken(this.session.id, this.player.cid);
    return this.operatorClient.bet(
      this.operator.apiConnectorId, this.player.cid, bet, sessionToken, roundId, this.correlationId,
    ).catch(reason => {
      this.logger.error(JSON.stringify(reason));
      this.playerPublisher.sendNotification(this.session.id,
        {
          notificationId: NotificationType.BET_FAILED,
          title: 'Wallet error',
          message: 'Oops, something went wrong with your wallet!',
        });
      throw reason;
    });
  }

  private getRoundOptions(type: RoundType): { bet: number; rtp: boolean, deductRound: boolean, countToLimit: boolean } {
    const result = {
      bet: Number(this.group.denominator),
      rtp: true,
      deductRound: true,
      countToLimit: true,
    };
    switch (type) {
      case RoundType.BET_BEHIND:
        result.rtp = false;
        result.deductRound = false;
        break;
      case RoundType.SCATTER:
      case RoundType.VOUCHER:
        result.bet = 0;
        result.countToLimit = false;
        break;
      case RoundType.REGULAR:
      default:
    }
    return result;
  }
}

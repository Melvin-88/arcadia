/* eslint-disable max-lines */
import { Injectable, Logger, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  RoundEntity,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionStatus,
  VoucherEntity,
  VoucherRepository,
  VoucherStatus,
} from 'arcadia-dal';
import { TransactionalHandler } from '../../common/transactional.handler';
import { BusEventType } from '../../event.bus/bus.event.type';
import { BaseEvent } from '../../event.bus/dto/base.event';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { getJackpotRoundId } from '../../jackpot.api.client/jackpotRoundIdFactory';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { BalanceData } from '../../operator.api.client/dto/balanceData';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { NotificationType } from '../../player.client/notification.type';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { RoundContext } from '../../round/round.context';
import { RoundServiceFactory } from '../../round/round.service.factory';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { AutoplayStatus } from '../player.handling/enum/autoplay.status';

@Injectable({ scope: Scope.REQUEST })
export class RoundEndHandler extends TransactionalHandler<BaseEvent> {
  private roundRepo: RoundRepository;
  private voucherRepo: VoucherRepository;

  private activeRound: RoundEntity;
  private disabledAutoplay = false;
  private vouchers: VoucherEntity[];

  constructor(
    private readonly robotClientService: RobotClientService,
    private readonly playerPublisher: PlayerClientService,
    private readonly workerClient: WorkerClientService,
    private readonly monitoringClientService: MonitoringWorkerClientService,
    private readonly operatorClient: OperatorApiClientService,
    private readonly roundServiceFactory: RoundServiceFactory,
    private readonly eventBus: EventBusPublisher,
    private readonly sessionDataManager: SessionDataManager,
  ) {
    super(new Logger(RoundEndHandler.name));
  }

  protected async init(data: BaseEvent): Promise<void> {
    await super.init(data);

    // transactional repos
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
    this.voucherRepo = this.entityManager.getCustomRepository(VoucherRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.cachedSession.id,
      {
        relations: ['rounds', 'vouchers'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected async handleEvent(): Promise<void> {
    this.activeRound = this.lockedSession.getActiveRound();
    if (!this.activeRound) {
      throw new RpcException('No active round for round end');
    }

    this.vouchers = this.lockedSession.vouchers?.length ? this.lockedSession.vouchers : [];

    await this.roundRepo.update(this.activeRound.id,
      { status: RoundStatus.COMPLETED, endDate: new Date() });
    if (this.activeRound.type === RoundType.VOUCHER && this.activeRound.voucherId) {
      await this.onVoucherRoundEnd();
    }
    if (this.activeRound.type === RoundType.SCATTER) {
      await this.onScatterRoundEnd();
    } else {
      await this.autoplayRoundsLimitCheck();
    }
    await this.notifyBetBehindRoundEnd();

    try {
      await this.roundPayout();
    } catch (err) {
      await this.onPayoutError(err);
      throw new RpcException(err);
    }

    if (this.canProceedPlay()) {
      await this.startNewRound();
    } else {
      await this.finalize();
    }

    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.ROUND_ENDED,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
  }

  private async roundPayout(): Promise<BalanceData> {
    const { winInCash } = this.activeRound;
    const sessionToken = await this.sessionDataManager
      .getSessionToken(this.lockedSession.id, this.cachedPlayer.cid);
    await this.jackpotRoundFinish(sessionToken);
    const transactionId = await this.sessionDataManager.getRoundTransactionId(this.activeRound.id);
    const payout = await this.operatorClient
      .payout(this.correlationId, this.cachedOperator.apiConnectorId, this.cachedPlayer.cid, winInCash,
        sessionToken, this.activeRound.id, transactionId)
      .catch(reason => {
        throw reason;
      });
    await this.sessionDataManager.deleteRoundTransactionId(this.activeRound.id);
    this.playerPublisher.notifyBalance(this.lockedSession.id, { valueInCash: payout.balance });
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.PAYOUT,
      source: EventSource.GAME,
      params: {
        sum: winInCash,
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
        transactionId,
      },
    });
    return payout;
  }

  private async jackpotRoundFinish(sessionToken: string): Promise<void> {
    try {
      const transactionId = await this.sessionDataManager.getJackpotTransactionId(this.activeRound.id);
      if (!transactionId) {
        this.logger.log(`No transactionId for jackpot, roundId: ${this.activeRound.id}`);
        return;
      }
      await this.operatorClient.payout(this.correlationId, this.cachedOperator.apiConnectorId,
        this.cachedPlayer.cid, 0, sessionToken, getJackpotRoundId(this.activeRound.id),
        transactionId);
      await this.sessionDataManager.deleteJackpotTransactionId(this.activeRound.id);
    } catch (e) {
      this.logger.error(`Jackpot transaction completion error, roundId: ${this.activeRound.id}, error: ${e.message}`);
    }
  }

  private async onPayoutError(err: any): Promise<void> {
    this.logger.error(`Payout failed, error: ${err.message}, sessionId: ${this.lockedSession.id}, roundId: ${this.activeRound.id}`);
    await this.monitoringClientService.sendAlertMessage({
      alertType: AlertType.CRITICAL,
      severity: AlertSeverity.HIGH,
      source: AlertSource.GAME_CORE,
      description: 'Payout failed',
      additionalInformation: {
        sessionId: this.lockedSession.id,
        roundId: this.activeRound.id,
        playerCid: this.cachedPlayer.cid,
      },
    });
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.END_SESSION,
      source: EventSource.GAME,
      params: {
        reason: 'Payout failed',
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
    this.playerPublisher.sendNotification(this.lockedSession.id,
      {
        notificationId: NotificationType.PAYOUT_FAILED,
        title: 'Wallet error',
        message: 'Payout failed',
      });
    await this.disengage();
  }

  private async notifyBetBehindRoundEnd() {
    const sessions = await this.sessionRepo.getBetBehindersFromQueue(this.cachedSession.queue.id);
    sessions
      .filter(session => session.rounds.find(round => round.status === RoundStatus.ACTIVE))
      .forEach(session => this.eventBus
        .sendEvent({
          sessionId: session.id,
          type: BusEventType.BET_BEHIND_ROUND_END,
        }, this.correlationId));
  }

  private isForcedDisengage(): boolean {
    return this.lockedSession.isDisconnected || this.lockedSession.status === SessionStatus.FORCED_AUTOPLAY;
  }

  private canReBuy(): boolean {
    if (this.cachedGroup.stackBuyLimit - this.lockedSession.totalStacksUsed <= 0) {
      this.playerPublisher.sendNotification(this.lockedSession.id,
        {
          notificationId: NotificationType.ROUND_LIMIT_REACHED,
          title: 'Round limit reached!',
          message: 'You have reached the regulatory round limit, see you next time.',
        });
      return false;
    }
    return !this.isForcedDisengage();
  }

  private async initReBuy(): Promise<void> {
    const roundsAllowed = this.cachedGroup.stackBuyLimit - this.lockedSession.totalStacksUsed;
    await this.sessionRepo.update(this.lockedSession.id, { status: SessionStatus.RE_BUY },
      data => this.playerPublisher.sessionState(this.lockedSession.id, { status: data.status }));
    this.playerPublisher.notifyRebuy(this.lockedSession.id, { roundsAllowed });
    this.workerClient.stopIdleTimeout(this.lockedSession.id, this.correlationId);
    await this.workerClient.startGraceTimeout(this.lockedSession.id, this.correlationId);
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.RESERVATION_WAIT,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
      },
    });
  }

  private canProceedPlay(): boolean {
    return this.lockedSession.roundsLeft > 0 && !this.isForcedDisengage();
  }

  private async startNewRound() {
    let roundType = this.lockedSession.pendingScatter > 0 ? RoundType.SCATTER : RoundType.REGULAR;
    const voucher = this.vouchers
      .find(({ status }) => status === VoucherStatus.PENDING);
    if (voucher) {
      roundType = RoundType.VOUCHER;
    }
    const context: RoundContext = new RoundContext(
      this.lockedSession, this.cachedSession.queue, this.cachedMachine, this.cachedPlayer, this.cachedGroup,
      this.cachedOperator, this.isAutoplayRound(), voucher, this.correlationId);
    try {
      const nextRound = await this.roundServiceFactory
        .create(context, this.entityManager)
        .startRound(roundType);
      await this.robotClientService
        .sendAllowCoinsMessage(nextRound.coins, this.cachedMachine.serial, this.lockedSession.id);
      await this.workerClient.startIdleTimeout(this.cachedSession.id, this.correlationId);
    } catch (err) {
      await this.disengage();
      // todo: send some message to player
      throw err;
    }
  }

  private isAutoplayRound(): boolean {
    return (this.lockedSession.status === SessionStatus.AUTOPLAY
      || this.lockedSession.status === SessionStatus.FORCED_AUTOPLAY)
      && !this.disabledAutoplay;
  }

  private async finalize() {
    if (this.lockedSession.status === SessionStatus.AUTOPLAY
      || this.lockedSession.status === SessionStatus.FORCED_AUTOPLAY) {
      await this.disableAutoplay();
    }
    if (this.canReBuy()) {
      await this.initReBuy();
    } else {
      await this.disengage();
    }
  }

  private async disengage() {
    await this.robotClientService.sendDisengageMessage(this.lockedSession.id, this.cachedMachine.serial);
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.BREAKUP,
      source: EventSource.GAME,
      params: {
        sessionId: this.cachedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
    if (this.lockedSession.status === SessionStatus.FORCED_AUTOPLAY) {
      await this.monitoringClientService.sendEventLogMessage({
        eventType: EventType.IDLE_DISCONNECT,
        source: EventSource.GAME,
        params: {
          sessionId: this.lockedSession.id,
          round: this.activeRound.id,
          groupId: this.cachedGroup.id,
          machineId: this.cachedMachine.id,
          machineSerial: this.cachedMachine.serial,
          operatorId: this.cachedOperator.id,
        },
      });
    }
  }

  private async onScatterRoundEnd() {
    await this.sessionRepo.decrement({ id: this.lockedSession.id },
      'pendingScatter', 1);
    this.lockedSession.pendingScatter -= 1;
  }

  private async onVoucherRoundEnd() {
    await this.voucherRepo.update(this.activeRound.voucherId,
      { status: VoucherStatus.USED });
    const currentVoucher = this.vouchers
      .find(({ id }) => id === this.activeRound.voucherId);
    if (currentVoucher) {
      currentVoucher.status = VoucherStatus.USED;
    }
  }

  private async autoplayRoundsLimitCheck() {
    const { autoplay } = await this.sessionDataManager.getSessionData(this.lockedSession.id);
    if (this.lockedSession.status === SessionStatus.AUTOPLAY && autoplay) {
      if (autoplay.stopAfterRounds === 1) { // last autoplay round played
        await this.disableAutoplay();
        await this.workerClient.startIdleTimeout(this.lockedSession.id, this.correlationId);
      } else { // more rounds to autoplay
        autoplay.stopAfterRounds -= 1;
        await this.sessionDataManager.updateSessionData({ autoplay }, this.lockedSession.id);
      }
    }
  }

  private async disableAutoplay() {
    await this.robotClientService.sendStopAutoplayMessage(this.cachedMachine.serial, this.lockedSession.id);
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.STOP_AUTO_MODE,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
      },
    });
    this.playerPublisher.notifyAutoplay(this.lockedSession.id,
      { status: AutoplayStatus.FORCED_DISABLE });
    await this.sessionRepo.update(this.lockedSession.id, { status: SessionStatus.PLAYING },
      data => this.playerPublisher.sessionState(this.lockedSession.id, { status: data.status }),
    );
    await this.sessionDataManager.removeSessionData({ autoplay: {} as any }, this.lockedSession.id);
    this.disabledAutoplay = true;
  }
}

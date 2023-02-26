/* eslint-disable max-lines */
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AutoplayConfiguration,
  BetBehindConfiguration,
  connectionNames,
  InjectRepository,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  QueueStatus,
  RngChipPrizeRepository,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionEndReason,
  SessionEntity,
  SessionRepository,
  SessionStatus,
  TiltMode,
  VoucherRepository,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import * as CacheManager from 'cache-manager';
import * as moment from 'moment';
import { EMPTY, from, of } from 'rxjs';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from '../../../decorators/cache';
import { CacheClear } from '../../../decorators/cache.clear';
import { toCash } from '../../../util/toCash';
import { LobbyChangeBetDto } from '../../auth/dto/lobby.change.bet.dto';
import { BalanceNotifier } from '../../balance.notifier/balance.notifier';
import { SessionAwareDto } from '../../dto/session.aware.dto';
import { BusEventType } from '../../event.bus/bus.event.type';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { REDIS_CACHE } from '../../global.cache/redis.cache.module';
import { JackpotApiClientService } from '../../jackpot.api.client/jackpot.api.client.service';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { NotificationType } from '../../player.client/notification.type';
import { PlayerClientService } from '../../player.client/player.client.service';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { sessionCacheKeyFactory } from '../../session/session.cache.key.factory';
import { getSessionHash } from '../../session/session.hash';
import { SessionService } from '../../session/session.service';
import { QueueChangeOfferDto } from '../../worker.client/dto';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { VoucherDto } from '../robot.handling/dto/voucher.dto';
import { OrientationChangedMessageDto } from './dto/orientation.changed.message.dto';
import { PlayerJoinedMessageDto } from './dto/player.joined.message.dto';
import { QueueBalanceDto } from './dto/queueBalanceDto';
import { QuitDto } from './dto/quit.dto';
import { SetAngleMessageDto } from './dto/set.angle.message.dto';
import { SettingsUpdateMessageDto } from './dto/settings.update.message.dto';
import { VideoMessageDto } from './dto/video.message.dto';
import { AutoplayStatus } from './enum/autoplay.status';
import { QuitReason } from './enum/quit.reason';

@Injectable()
export class PlayerMessageService {
  constructor(
    private readonly playerPublisher: PlayerClientService,
    private readonly robotPublisher: RobotClientService,
    private readonly workerPublisher: WorkerClientService,
    private readonly monitoringService: MonitoringWorkerClientService,
    private readonly logger: AppLogger,
    private readonly queueManager: QueueManagerService,
    private readonly sessionService: SessionService,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    @InjectRepository(RoundRepository, connectionNames.DATA)
    private readonly roundRepo: RoundRepository,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(VoucherRepository, connectionNames.DATA)
    private readonly voucherRepo: VoucherRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    @Inject(REDIS_CACHE) public readonly cacheManager: CacheManager.Cache,
    private readonly operatorClient: OperatorApiClientService,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA)
    private readonly rngChipPrizeRepo: RngChipPrizeRepository,
    private readonly jackpotClientService: JackpotApiClientService,
    private readonly balanceNotifier: BalanceNotifier,
    private readonly sessionDataManager: SessionDataManager,
    private readonly eventBus: EventBusPublisher,
  ) {
  }

  public async userJoinedHandler(data: PlayerJoinedMessageDto, correlationId?: string): Promise<void> {
    const { session, reconnect, sessionId } = data;
    const freshSession = await this.sessionRepo.findOne(sessionId);
    if (!freshSession || !session) {
      this.logger.warn(`Session is closed, sessionId: ${sessionId}`);
      return;
    }
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.STARTED,
      source: EventSource.GAME,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
    if (reconnect && freshSession.status === SessionStatus.FORCED_AUTOPLAY) {
      await this.robotPublisher.sendStopAutoplayMessage(session.machine.serial, sessionId);
      await this.monitoringService.sendEventLogMessage({
        eventType: EventType.STOP_AUTO_MODE,
        source: EventSource.GAME,
        params: {
          sessionId: session.id,
          machineSerial: session.machine?.serial,
        },
      });
      this.playerPublisher.notifyAutoplay(session.id, { status: AutoplayStatus.FORCED_DISABLE });
      await this.sessionRepo.update(sessionId, { status: SessionStatus.PLAYING },
        data => this.playerPublisher.sessionState(sessionId, { status: data.status }));
      await this.workerPublisher.startIdleTimeout(sessionId, correlationId);
    }
    if (freshSession.isDisconnected) {
      const offlineTime = moment().diff(session.lastDisconnectDate, 'seconds');
      await this.sessionRepo.createQueryBuilder('session').update()
        .set({
          offlineDuration: () => `${this.sessionRepo.metadata
            .findColumnWithPropertyName('offlineDuration').databaseName} + ${offlineTime}`,
          isDisconnected: false,
        }).execute();
    }
    await this.queueManager.notifyQueueUpdate(session.queue.id, session);
  }

  public async userDisconnectHandler(data: SessionAwareDto): Promise<void> {
    const { sessionId, session } = data;
    const freshSession = sessionId && (await this.sessionRepo.findOne(sessionId));
    if (!freshSession || !session) {
      this.logger.warn(`Session is closed, sessionId: ${sessionId}`);
      return;
    }
    await this.sessionRepo.update(freshSession.id, {
      isDisconnected: true,
      lastDisconnectDate: new Date(),
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.DISCONNECTED,
      source: EventSource.PLAYER,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
  }

  public async terminateViewers(ids: number[]): Promise<void> {
    const queueIds: { queueId: string }[] = await this.sessionRepo.createQueryBuilder('s')
      .leftJoin('s.queue', 'q')
      .select('q.id', 'queueId')
      .distinct(true)
      .where('s.id IN (:...ids)', { ids })
      .getRawMany();
    await this.sessionRepo.createQueryBuilder('s')
      .update()
      .set({
        viewerDuration: () => 'TIMESTAMPDIFF(SECOND, create_date, NOW())',
      })
      .where('id IN (:...ids)', { ids })
      .execute();
    await from(ids).pipe(
      concatMap(async id => {
        await this.sessionService.finalizeSession(id, true, SessionEndReason.VIEWER_DISCONNECTED);
        return id;
      }),
      toArray()).toPromise();
    queueIds.forEach(({ queueId }) => {
      this.queueManager.notifyQueueUpdate(Number(queueId));
    });
  }

  public async playerQuit(data: QuitDto): Promise<void> {
    const {
      session: cachedSession, sessionId, reason, correlationId,
    } = data;
    const session = await this.sessionRepo.findOneOrFail(sessionId);
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.QUIT,
      source: EventSource.PLAYER,
      params: {
        reason,
        sessionId: cachedSession.id,
        machineSerial: cachedSession.machine?.serial,
      },
    });
    if (!session.isActivePlayingStatus()) {
      const duration = moment().diff(session.createDate, 'seconds');
      await this.sessionRepo.update(session.id, {
        viewerDuration: session.status === SessionStatus.VIEWER ? duration : session.viewerDuration,
        queueDuration: session.status === SessionStatus.QUEUE ? duration - session.viewerDuration : 0,
      });
      await this.sessionService.finalizeSession(session.id, false, `quit: ${reason}`);
      await this.queueManager.notifyQueueUpdate(cachedSession.queue.id, session);
    } else if (reason === QuitReason.VIDEO_FAILED) {
      await this.queueRepo.update(cachedSession.queue.id, { status: QueueStatus.DRYING });
      await this.eventBus.terminateSession({
        type: BusEventType.TERMINATE_SESSION,
        sessionId: session.id,
        terminate: false,
      }, correlationId);
    }
  }

  public async leaveQueue(cachedSession: SessionEntity): Promise<void> {
    const session = await this.sessionRepo.findOneOrFail(cachedSession.id)
      .catch(reason => {
        throw new RpcException(reason);
      });
    if (session.status !== SessionStatus.QUEUE && session.status !== SessionStatus.QUEUE_BET_BEHIND) {
      throw new RpcException(`Unexpected status to leave the queue: ${session.status}`);
    }
    const newStatus = session.status === SessionStatus.QUEUE
      ? SessionStatus.VIEWER
      : SessionStatus.VIEWER_BET_BEHIND;
    await this.sessionRepo.update(session.id, {
      status: newStatus,
      roundsLeft: 0,
      buyDate: null,
    }, data => this.playerPublisher.sessionState(session.id, { status: data.status }));
    await this.queueManager.notifyQueueUpdate(cachedSession.queue.id);
  }

  public async cancelStacks(cachedSession: SessionEntity): Promise<void> {
    const session = await this.sessionRepo.findOneOrFail(cachedSession.id)
      .catch(reason => {
        throw new RpcException(reason);
      });
    if (session.status !== SessionStatus.PLAYING
      && session.status !== SessionStatus.AUTOPLAY
      && session.status !== SessionStatus.FORCED_AUTOPLAY) {
      throw new RpcException(`Unexpected status to cancel stacks: ${session.status}`);
    }
    await this.sessionRepo.update(session.id, { roundsLeft: session.pendingScatter });
    this.playerPublisher.sessionState(session.id,
      { status: session.status, roundsLeft: session.pendingScatter });
  }

  // todo: extract this method to transactional handler class (like coin shot handler) and refactor
  @CacheClear(args => sessionCacheKeyFactory(args[0]?.id))
  async buyStacksHandler(
    cachedSession: SessionEntity, stacks: number, voucherId?: number, correlationId: string = uuidv4(),
  ): Promise<void> {
    const {
      group, player, machine, operator,
    } = cachedSession;
    const session = await this.sessionRepo
      .findOneOrFail(cachedSession.id, { relations: ['rounds'] })
      .catch(reason => {
        throw new RpcException(reason);
      });
    if (session.status !== SessionStatus.VIEWER
      && session.status !== SessionStatus.VIEWER_BET_BEHIND
      && session.status !== SessionStatus.RE_BUY) {
      throw new RpcException(`Unexpected "buy" request for session: sessionId=${session.id}, correlationId=${correlationId}`);
    }
    await this.workerPublisher.stopGraceTimeout(cachedSession.id, correlationId);
    // re-buy reject detection
    if (stacks < 1) {
      await this.robotPublisher.sendDisengageMessage(cachedSession.id, machine.serial);
      return;
    }
    let isVoucherBuy = false;
    if (voucherId) {
      const doubleCheckVoucher = await this.voucherRepo
        .getVoucherForSession(operator.id, group.id, player.cid);
      if (voucherId !== doubleCheckVoucher?.voucherId) {
        throw new RpcException(`Invalid or stale voucher, voucherId: ${voucherId}`);
      }
      await this.voucherRepo.update(voucherId, { session });
      // eslint-disable-next-line no-param-reassign
      stacks = 1;
      isVoucherBuy = true;
    }
    const sessionToken = await this.sessionDataManager.getSessionToken(session.id, player.cid);
    const playerBalance = await this.operatorClient
      .balance(correlationId, operator.apiConnectorId, player.cid, sessionToken)
      .catch(reason => {
        throw new RpcException(reason);
      });

    const canBuyStacks = new BigNumber(playerBalance.balance)
      .dividedToIntegerBy(toCash(group.denominator, session.currencyConversionRate)).toNumber();
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.STACK_RESERVATION,
      source: EventSource.GAME,
      params: {
        balance: playerBalance.balance,
        stacks,
        sessionId: session.id,
        machineSerial: machine.serial,
      },
    });
    if (!isVoucherBuy && canBuyStacks < stacks) {
      this.playerPublisher.sendNotification(cachedSession.id,
        {
          notificationId: NotificationType.INSUFFICIENT_FUNDS,
          title: 'Insufficient funds',
          message: `Oops, not enough money to buy ${stacks} stacks!`,
          data: { canBuy: canBuyStacks },
        });
      if (session.status === SessionStatus.RE_BUY) {
        await this.robotPublisher.sendDisengageMessage(session.id, machine.serial);
      }
      return;
    }
    this.playerPublisher.notifyBuyResult(session.id, getSessionHash(session), stacks);
    if (session.status === SessionStatus.VIEWER
      || session.status === SessionStatus.VIEWER_BET_BEHIND) {
      await this.sessionRepo.update(session.id, {
        status: session.status === SessionStatus.VIEWER ? SessionStatus.QUEUE : SessionStatus.QUEUE_BET_BEHIND,
        viewerDuration: moment().diff(session.createDate, 'seconds'),
        roundsLeft: stacks,
        buyDate: new Date(),
      }, data => this.playerPublisher.sessionState(session.id, { status: data.status }));
      const freshMachine = await this.machineRepo.findOneOrFail(machine.id);
      if (freshMachine.status === MachineStatus.READY) {
        this.eventBus.engageNextSession({
          type: BusEventType.ENGAGE_SESSION,
          machineId: machine.id,
        }, correlationId);
      }
    } else if (session.status === SessionStatus.RE_BUY) {
      await this.sessionRepo.update(session.id, { roundsLeft: stacks });
      this.eventBus.engageNextSession({
        type: BusEventType.ENGAGE_SESSION,
        machineId: machine.id,
        reBuySessionId: session.id,
      }, correlationId);
    }
    await this.queueManager.notifyQueueUpdate(cachedSession.queue.id, cachedSession);
  }

  public balanceHandler(sessionId: number, operatorId: string, playerCid: string, correlationId: string): void {
    this.balanceNotifier.notifyBalance(sessionId, operatorId, playerCid, correlationId);
  }

  async enableAutoplayHandler(session: SessionEntity, autoplay: AutoplayConfiguration): Promise<void> {
    const freshSession = await this.sessionRepo.findOne(session.id);
    if (freshSession.status === SessionStatus.PLAYING) {
      await this.robotPublisher.sendAutoplayMessage(session.machine.serial, session.id, autoplay.tiltMode);
      await this.sessionRepo.update(session.id, { status: SessionStatus.AUTOPLAY },
        data => this.playerPublisher.sessionState(freshSession.id, { status: data.status }));
      await this.sessionDataManager.updateSessionData({ autoplay }, session.id);
    }
  }

  public async disableAutoplayHandler(data: SessionAwareDto): Promise<void> {
    const { sessionId, session, correlationId } = data;
    const freshSession = await this.sessionRepo.findOneOrFail(sessionId);
    if (freshSession.status === SessionStatus.AUTOPLAY
      || freshSession.status === SessionStatus.FORCED_AUTOPLAY) {
      await this.robotPublisher.sendStopAutoplayMessage(session.machine.serial, session.id);
      await this.monitoringService.sendEventLogMessage({
        eventType: EventType.STOP_AUTO_MODE,
        source: EventSource.GAME,
        params: {
          sessionId: session.id,
          machineSerial: session.machine?.serial,
        },
      });
      await this.workerPublisher.startIdleTimeout(session.id, correlationId);
      await this.sessionRepo.update(session.id, { status: SessionStatus.PLAYING },
        data => this.playerPublisher.sessionState(freshSession.id, { status: data.status }));
    }
    await this.sessionDataManager.removeSessionData({ autoplay: {} as any }, session.id);
  }

  public async enableBetBehindHandler(sessionId: number, config: BetBehindConfiguration): Promise<void> {
    const session = await this.sessionRepo.findOneOrFail(sessionId);
    if (session.status !== SessionStatus.VIEWER && session.status !== SessionStatus.QUEUE) {
      throw new RpcException(`Can't enable Bet Behind. Unexpected sessions status=${session.status}, sessionId=${session.id}`);
    }
    const status = session.status === SessionStatus.QUEUE
      ? SessionStatus.QUEUE_BET_BEHIND
      : SessionStatus.VIEWER_BET_BEHIND;
    await this.sessionRepo.update(session.id, { status },
      () => this.playerPublisher.sessionState(session.id, { status }));
    await this.sessionDataManager.updateSessionData({ betBehind: config }, session.id);
  }

  public async disableBetBehindHandler(sessionId: number): Promise<void> {
    const session = await this.sessionRepo
      .findOneOrFail(sessionId, { relations: ['rounds'] });
    if (session.status !== SessionStatus.VIEWER_BET_BEHIND
      && session.status !== SessionStatus.QUEUE_BET_BEHIND) {
      throw new RpcException(`Can't disable Bet Behind. Unexpected sessions status=${session.status}, sessionId=${session.id}`);
    }
    const activeBbRound = session.rounds?.find(round => round.status === RoundStatus.ACTIVE
      && round.type === RoundType.BET_BEHIND);
    if (!activeBbRound) {
      const status = session.status === SessionStatus.QUEUE_BET_BEHIND
        ? SessionStatus.QUEUE
        : SessionStatus.VIEWER;
      await this.sessionRepo.update(session.id, { status },
        data => this.playerPublisher.sessionState(session.id, { status: data.status }));
    }
    await this.sessionDataManager.removeSessionData({ betBehind: {} as any }, session.id);
  }

  public async handleIdleTimeout(data: SessionAwareDto): Promise<void> { // session should have machine and player
    const { sessionId, session } = data;
    if (!session) {
      throw new RpcException(`SessionId: ${sessionId || 'none'} not found, idle timeout handler`);
    }
    const { machine, configuration } = session;
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.IDLE,
      source: EventSource.GAME,
      params: {
        sessionId: session.id,
        machineSerial: machine?.serial,
      },
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.START_AUTO_MODE,
      source: EventSource.GAME,
      params: {
        sessionId: session.id,
        machineSerial: machine?.serial,
      },
    });
    await this.sessionRepo.update(session.id, { status: SessionStatus.FORCED_AUTOPLAY },
      data => this.playerPublisher.sessionState(session.id, { status: data.status }));
    await this.robotPublisher
      .sendAutoplayMessage(machine.serial, session.id, TiltMode.AUTO);
    this.playerPublisher.notifyAutoplay(session.id,
      {
        status: AutoplayStatus.FORCED_ENABLE,
        config: configuration.autoplay,
      });
  }

  public async handleGraceTimeout(session: SessionEntity): Promise<void> { // session should have machine and player
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.GRACE,
      source: EventSource.GAME,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
    await this.robotPublisher.sendDisengageMessage(session.id, session.machine.serial);
  }

  public async handleEngageTimeout(session: SessionEntity): Promise<void> {
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.ENGAGE_TIMEOUT,
      source: EventSource.GAME,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
    const correlationId = uuidv4();
    this.logger.log(`Forcing "init" message to robot. Serial=${session.machine.serial}, sessionId=${session.id}, correlationId=${correlationId}`);
    this.playerPublisher.forceInitMessage(session.machine.serial, session.id, correlationId);
  }

  public async handleQueueChangeOffer(data: QueueChangeOfferDto): Promise<void> {
    if (!data.session) {
      throw new RpcException('No session to offer new queue');
    }
    const {
      sessionId, toQueueId, position,
    } = data;
    const toMachine = await this.machineRepo.createQueryBuilder('m')
      .innerJoin('m.queue', 'q')
      .where('q.id = :toQueueId', { toQueueId })
      .getOne();
    if (!toMachine) {
      throw new RpcException('No machine to send offer to');
    }
    this.playerPublisher.queueBalance(sessionId, {
      machineId: toMachine.id,
      machineName: toMachine.name,
      queuePosition: position,
    });
  }

  @CacheClear(args => sessionCacheKeyFactory(args[0].sessionId))
  public async handleQueueBalanceDecision(data: QueueBalanceDto): Promise<void> {
    const { session: cachedSession, decision, sessionId } = data;
    const session = await this.sessionRepo.findOneOrFail(sessionId);
    if (!session.offeredQueueId) {
      throw new RpcException('No target queue to switch to');
    }
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.SWITCH_QUEUE,
      source: EventSource.PLAYER,
      params: {
        sessionId: cachedSession.id,
        machineSerial: cachedSession.machine?.serial,
        decision,
      },
    });
    if (decision === 'accept') {
      if (session.status !== SessionStatus.QUEUE) {
        throw new RpcException('Session cant switch from non-queue status');
      }
      const newQueue = await this.queueRepo.findOneOrFail(session.offeredQueueId,
        { relations: ['machine', 'machine.group'] });
      await this.sessionRepo.update(session.id,
        {
          queue: newQueue,
          machine: newQueue.machine,
          group: newQueue.machine.group,
          offeredQueueId: null,
        });
      await this.queueManager.notifyQueueUpdate(cachedSession.queue.id, session);
      this.playerPublisher.forceReconnect(session.id);
      if (newQueue.machine.status === MachineStatus.READY) {
        this.eventBus.engageNextSession({
          type: BusEventType.ENGAGE_SESSION,
          machineId: newQueue.machine.id,
        });
      }
    }
  }

  public async handleListBets(session: SessionEntity): Promise<void> {
    const result = await this.getBetsList(session);
    this.playerPublisher.sendBets(session.id, result);
  }

  @Cache({ ttl: 10 }, args => (`change-bet-${args[0].id}`))
  private async getBetsList(session: SessionEntity): Promise<LobbyChangeBetDto> {
    const { operator } = session;
    const groups = await this.machineRepo.getLobbyAndChangeBetGroupData(operator.id);
    const groupsMapped = await from(groups).pipe(
      concatMap(async value => {
        if (Number(value.groupId) === Number(session.group.id)) {
          return EMPTY;
        }
        const payTable = await this.rngChipPrizeRepo
          .getPayTable(session.currencyConversionRate, value.prizeGroup, value.config.rtpSegment);
        return of({
          groupId: value.groupId,
          groupName: value.groupName,
          jackpotGameId: value.jackpotGameId,
          queueLength: value.queueLength,
          betInCash: toCash(value.denominator, session.currencyConversionRate),
          currency: session.currency,
          color: value.color,
          payTable,
        });
      }),
      mergeMap(value => value),
      toArray(),
    ).toPromise();
    return {
      jackpotOperatorId: operator.blueRibbonId,
      groups: groupsMapped,
    };
  }

  public async sendVoucher(session: SessionEntity): Promise<void> {
    const voucher = await this.getVoucher(session);
    if (voucher) {
      this.playerPublisher.sendVoucher(session.id, {
        voucherId: voucher.voucherId,
        expirationDate: moment(voucher.expirationDate).diff(moment(), 'year') > 25
          ? undefined
          : voucher.expirationDate,
      });
    }
  }

  @Cache({ ttl: 2 }, args => (`get-voucher-${args[0].id}`))
  private getVoucher(session: SessionEntity): Promise<VoucherDto> {
    const { group, player, operator } = session;
    return this.voucherRepo.getVoucherForSession(operator.id, group.id, player.cid);
  }

  public async userCeaseFireHandler(session: SessionEntity): Promise<void> {
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.FIRE_RELEASE,
      source: EventSource.PLAYER,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
  }

  public async userFireHandler(session: SessionEntity): Promise<void> {
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.FIRE_PUSH,
      source: EventSource.PLAYER,
      params: {
        sessionId: session.id,
        machineSerial: session.machine?.serial,
      },
    });
  }

  private async sendNoParamsEventLog(eventType: EventType, data: SessionAwareDto): Promise<void> {
    const round = await this.roundRepo.findOne({
      session: { id: data.sessionId },
      status: RoundStatus.ACTIVE,
    });
    await this.monitoringService.sendEventLogMessage({
      eventType,
      source: EventSource.PLAYER,
      params: {
        sessionId: data.sessionId,
        machineSerial: data.session?.machine?.serial,
        machineId: data.session?.machine?.id,
        groupId: data.session?.group?.id,
        operatorId: data.session?.operator?.id,
        round: round?.id,
      },
    });
  }

  public async armSwing(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.ARM_SWING, data);
  }

  public async setAngle(data: SetAngleMessageDto): Promise<void> {
    const round = await this.roundRepo.findOne({
      session: { id: data.sessionId },
      status: RoundStatus.ACTIVE,
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.SET_ANGLE,
      source: EventSource.PLAYER,
      params: {
        sessionId: data.sessionId,
        machineSerial: data.session?.machine?.serial,
        machineId: data.session?.machine?.id,
        groupId: data.session?.group?.id,
        operatorId: data.session?.operator?.id,
        round: round.id,
        angle: data.angle,
      },
    });
  }

  public async orientationChanged(data: OrientationChangedMessageDto): Promise<void> {
    const round = await this.roundRepo.findOne({
      session: { id: data.sessionId },
      status: RoundStatus.ACTIVE,
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.ORIENTATION_CHANGED,
      source: EventSource.PLAYER,
      params: {
        sessionId: data.sessionId,
        machineSerial: data.session?.machine?.serial,
        machineId: data.session?.machine?.id,
        groupId: data.session?.group?.id,
        operatorId: data.session?.operator?.id,
        round: round?.id,
        orientation: data.orientation,
      },
    });
  }

  public async video(data: VideoMessageDto): Promise<void> {
    const round = await this.roundRepo.findOne({
      session: { id: data.sessionId },
      status: RoundStatus.ACTIVE,
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.VIDEO,
      source: EventSource.PLAYER,
      params: {
        sessionId: data.sessionId,
        machineSerial: data.session?.machine?.serial,
        machineId: data.session?.machine?.id,
        groupId: data.session?.group?.id,
        operatorId: data.session?.operator?.id,
        round: round?.id,
        type: data.event.type,
        status: data.event.status,
      },
    });
  }

  public async settingsUpdate(data: SettingsUpdateMessageDto): Promise<void> {
    const round = await this.roundRepo.findOne({
      session: { id: data.sessionId },
      status: RoundStatus.ACTIVE,
    });
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.SETTINGS_UPDATE,
      source: EventSource.PLAYER,
      params: {
        sessionId: data.sessionId,
        machineSerial: data.session?.machine?.serial,
        machineId: data.session?.machine?.id,
        groupId: data.session?.group?.id,
        operatorId: data.session?.operator?.id,
        round: round.id,
        settings: data.settings,
      },
    });
  }

  public async menuClicked(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.MENU_CLICKED, data);
  }

  public async menuClosed(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.MENU_CLOSED, data);
  }

  public async lostFocus(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.LOST_FOCUS, data);
  }

  public async regainedFocus(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.REGAINED_FOCUS, data);
  }

  public async init(data: SessionAwareDto): Promise<void> {
    await this.sendNoParamsEventLog(EventType.ENGAGED, data);
  }

  public async roundEndDelay(data: SessionAwareDto): Promise<void> {
    const { sessionId, correlationId } = data;
    this.eventBus.sendRoundEnd({
      type: BusEventType.ROUND_END,
      sessionId,
    }, correlationId);
  }

  public async readyForRound(data: SessionAwareDto): Promise<void> {
    const { sessionId, correlationId } = data;
    const activeRound = await this.roundRepo.findOneOrFail({
      session: { id: sessionId },
      status: RoundStatus.ACTIVE,
    }).catch(reason => {
      this.logger.warn('readyRorRound: No active round');
      throw new RpcException(reason);
    });
    if (activeRound.coins === 0) {
      this.workerPublisher.stopRoundEndDelayTimeout(sessionId, correlationId);
      this.eventBus.sendRoundEnd({
        type: BusEventType.ROUND_END,
        sessionId,
      }, correlationId);
    }
  }
}

/* eslint-disable max-lines */
import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  BetBehindConfiguration,
  RoundEntity,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionStatus,
} from 'arcadia-dal';
import { TransactionalHandler } from '../../common/transactional.handler';
import { BusEventType } from '../../event.bus/bus.event.type';
import { BaseEvent } from '../../event.bus/dto/base.event';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { getJackpotRoundId } from '../../jackpot.api.client/jackpotRoundIdFactory';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { NotificationType } from '../../player.client/notification.type';
import { PlayerClientService } from '../../player.client/player.client.service';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';

@Injectable({ scope: Scope.REQUEST })
export class BbRoundEndHandler extends TransactionalHandler<BaseEvent> {
  // transactional repos
  private roundRepo: RoundRepository;

  private bbConfig: BetBehindConfiguration;
  private activeRound: RoundEntity;

  constructor(logger: AppLogger,
              private readonly playerPublisher: PlayerClientService,
              private readonly monitoringPublisher: MonitoringWorkerClientService,
              private readonly operatorClient: OperatorApiClientService,
              private readonly eventPublisher: EventBusPublisher,
              private readonly sessionDataManager: SessionDataManager,
  ) {
    super(logger);
  }

  protected async init(data: BaseEvent): Promise<void> {
    await super.init(data);

    // transactional repos
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.cachedSession.id,
      {
        // todo: remove rounds from lock, get active round from db directly
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
    this.bbConfig = (await this.sessionDataManager.getSessionData(this.lockedSession.id)).betBehind;
  }

  // todo: move the whole class functionality into main round end handler class
  protected async handleEvent(): Promise<void> {
    if (this.lockedSession.status !== SessionStatus.VIEWER_BET_BEHIND
      && this.lockedSession.status !== SessionStatus.QUEUE_BET_BEHIND) {
      throw new RpcException(`Session is not in BB status!
      SessionId=${this.lockedSession.id}, status=${this.lockedSession.status}, correlationId=${this.correlationId}`);
    }
    this.activeRound = this.lockedSession.rounds
      .find(round => round.status === RoundStatus.ACTIVE
        && round.type === RoundType.BET_BEHIND);
    if (!this.activeRound) {
      throw new RpcException(`No active round to complete!, SessionId=${this.lockedSession.id}, correlationId=${this.correlationId}`);
    }
    await this.roundRepo.update(this.activeRound.id,
      { status: RoundStatus.COMPLETED, endDate: new Date() });

    await this.roundPayout()
      .catch(reason => {
        this.onPayoutError(reason);
      });

    if (!this.bbConfig) {
      await this.disableBetBehind();
      return;
    }
    this.bbConfig.stopAfterRounds -= 1;
    if (this.bbConfig.stopAfterRounds < 1) {
      await this.disableBetBehind();
    } else {
      await this.sessionDataManager
        .updateSessionData({ betBehind: this.bbConfig }, this.lockedSession.id);
    }
  }

  private async roundPayout(): Promise<any> {
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
    await this.monitoringPublisher.sendEventLogMessage({
      eventType: EventType.PAYOUT,
      source: EventSource.GAME,
      params: {
        sum: winInCash,
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
    return payout;
  }

  private async jackpotRoundFinish(sessionToken: string): Promise<void> {
    try {
      const transactionId = await this.sessionDataManager.getJackpotTransactionId(this.activeRound.id);
      if (!transactionId) {
        this.logger.log(`No transactionId for jackpot, roundId=${this.activeRound.id}`);
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
    this.eventPublisher.finalizeSession({
      type: BusEventType.FINALIZE_SESSION,
      sessionId: this.lockedSession.id,
      terminate: true,
      reason: 'Transaction failed',
    }, this.correlationId);
    await this.monitoringPublisher.sendAlertMessage({
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
    this.playerPublisher.sendNotification(this.lockedSession.id,
      {
        notificationId: NotificationType.PAYOUT_FAILED,
        title: 'Wallet error',
        message: 'Payout failed',
      });
  }

  private async disableBetBehind(): Promise<void> {
    const status = this.lockedSession.status === SessionStatus.QUEUE_BET_BEHIND
      ? SessionStatus.QUEUE
      : SessionStatus.VIEWER;
    await this.sessionRepo.update(this.lockedSession.id, { status },
      () => this.playerPublisher.sessionState(this.lockedSession.id, { status }));
    await this.sessionDataManager.removeSessionData({ betBehind: {} as any }, this.lockedSession.id);
  }
}

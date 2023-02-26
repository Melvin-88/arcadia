/* eslint-disable max-lines */
import { Injectable, Scope } from '@nestjs/common';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  PlayerRepository,
  RoundEntity,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionStatus,
} from 'arcadia-dal';
import { TransactionalHandler } from '../common/transactional.handler';
import { BusEventType } from '../event.bus/bus.event.type';
import { FinalizeSessionEvent } from '../event.bus/dto/finalize.session.event';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { AppLogger } from '../logger/logger.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { WorkerClientService } from '../worker.client/worker.client.service';

@Injectable({ scope: Scope.REQUEST })
export class SessionTerminator extends TransactionalHandler<FinalizeSessionEvent> {
  // transactional repos
  private roundRepo: RoundRepository;
  private playerRepo: PlayerRepository;

  private activeRound: RoundEntity;
  private terminate: boolean;

  constructor(
    logger: AppLogger,
    private readonly operatorClient: OperatorApiClientService,
    private readonly eventPublisher: EventBusPublisher,
    private readonly monitoringWorkerClient: MonitoringWorkerClientService,
    private readonly coreWorkerClient: WorkerClientService,
    private readonly sessionDataManager: SessionDataManager,
    private readonly robotPublisher: RobotClientService,
    private readonly playerPublisher: PlayerClientService,
  ) {
    super(logger);
  }

  public async init(data: FinalizeSessionEvent): Promise<void> {
    await super.init(data);
    this.terminate = !!data.terminate;

    // transactional repos init
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
    this.playerRepo = this.entityManager.getCustomRepository(PlayerRepository);
  }

  public async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.cachedSession.id,
      {
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  public async handleEvent(): Promise<void> {
    this.activeRound = this.lockedSession.getActiveRound();
    if (!this.activeRound) {
      await this.finalizeOrSwitch(this.terminate);
      return;
    }
    this.coreWorkerClient.stopRoundEndDelayTimeout(this.lockedSession.id, this.correlationId);
    await this.terminateRound();
    const { betInCash, winInCash } = this.activeRound;
    const sessionToken = await this.sessionDataManager
      .getSessionToken(this.lockedSession.id, this.cachedPlayer.cid);
    const transactionId = await this.sessionDataManager.getRoundTransactionId(this.activeRound.id);
    try {
      await this.operatorClient.payout(this.correlationId, this.cachedOperator.apiConnectorId,
        this.cachedPlayer.cid, winInCash, sessionToken, this.activeRound.id,
        transactionId, false);
      await this.operatorClient.cancelBet(this.cachedOperator.apiConnectorId,
        this.cachedPlayer.cid, betInCash, sessionToken, this.activeRound.id, transactionId, this.correlationId);
    } catch (e) {
      await this.onTransactionError(e);
      return;
    }
    await this.monitoringWorkerClient.sendEventLogMessage({
      eventType: EventType.CANCEL_BET,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        round: this.activeRound.id,
        machineSerial: this.cachedMachine.serial,
      },
    });
    const betRollback = this.activeRound.type === RoundType.SCATTER
      ? 0 : Number(this.cachedGroup.denominator);
    const betInCashRollback = betRollback ? betInCash : 0;
    await this.sessionRepo.cancelBet(this.lockedSession.id, betRollback, betInCashRollback);
    await this.playerRepo.cancelBet(this.cachedPlayer.cid, betRollback);
    await this.finalizeOrSwitch(true);
  }

  private async finalizeOrSwitch(terminate: boolean): Promise<void> {
    if (terminate) {
      if (this.lockedSession.isEngaged()) {
        await this.disengage();
      } else {
        this.eventPublisher.finalizeSession({
          type: BusEventType.FINALIZE_SESSION,
          sessionId: this.lockedSession.id,
          terminate: true,
          reason: 'finalizeOrSwitch',
        }, this.correlationId);
      }
    } else {
      this.eventPublisher.queueChange({
        type: BusEventType.CHANGE_QUEUE,
        sessionId: this.lockedSession.id,
        ignoreMachines: [this.cachedMachine.id],
      }, this.correlationId);
    }
  }

  private async disengage(): Promise<void> {
    await this.sessionRepo.update(this.lockedSession.id, { status: SessionStatus.TERMINATING },
      data => this.playerPublisher.sessionState(this.lockedSession.id, { status: data.status }));
    this.robotPublisher.sendDisengageMessage(this.lockedSession.id, this.cachedMachine.serial);
  }

  private async terminateRound(): Promise<void> {
    await this.roundRepo.update(this.activeRound.id,
      { status: RoundStatus.TERMINATED, endDate: new Date() });
  }

  private async onTransactionError(error: Error) {
    this.logger.error(`Transaction failed for sessionId=${this.lockedSession.id}, `
      + `roundId: ${this.activeRound.id}, correlationId=${this.correlationId}`, error.message);
    if (this.lockedSession.isEngaged()) {
      await this.disengage();
    } else {
      this.eventPublisher.finalizeSession({
        sessionId: this.lockedSession.id,
        type: BusEventType.FINALIZE_SESSION,
        terminate: true,
        reason: 'Transaction failed',
      });
    }
    await this.monitoringWorkerClient.sendAlertMessage({
      alertType: AlertType.CRITICAL,
      source: AlertSource.GAME_CORE,
      severity: AlertSeverity.HIGH,
      description: `Transaction failed: ${error.message}`,
      additionalInformation: {
        sessionId: this.lockedSession.id,
        roundId: this.activeRound.id,
        machineId: this.cachedMachine.id,
        machineName: this.cachedMachine.name,
        machineSerial: this.cachedMachine.serial,
      },
    });
  }
}

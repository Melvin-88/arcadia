import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity, AlertSource, AlertType, RoundRepository, RoundType,
} from 'arcadia-dal';
import { BalanceNotifier } from '../../balance.notifier/balance.notifier';
import { TransactionalHandler } from '../../common/transactional.handler';
import { BusEventType } from '../../event.bus/bus.event.type';
import { BaseEvent } from '../../event.bus/dto/base.event';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { AppLogger } from '../../logger/logger.service';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { NotificationType } from '../../player.client/notification.type';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RoundContext } from '../../round/round.context';
import { RoundServiceFactory } from '../../round/round.service.factory';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';

@Injectable({ scope: Scope.REQUEST })
export class BbRoundStartHandler extends TransactionalHandler<BaseEvent> {
  private roundRepo: RoundRepository;
  private roundLimit: number;

  constructor(logger: AppLogger,
              private readonly operatorClient: OperatorApiClientService,
              private readonly roundServiceFactory: RoundServiceFactory,
              private readonly eventBus: EventBusPublisher,
              private readonly playerPublisher: PlayerClientService,
              private readonly balanceNotifier: BalanceNotifier,
              private readonly monitoringWorkerClient: MonitoringWorkerClientService,
              private readonly sessionDataManager: SessionDataManager,
  ) {
    super(logger);
  }

  protected async init(data: BaseEvent): Promise<void> {
    await super.init(data);

    this.roundLimit = this.cachedGroup.stackBuyLimit;

    // transactional repos
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.cachedSession.id,
      {
        lock: { mode: 'pessimistic_write' },
      });
    const { betBehind } = await this.sessionDataManager.getSessionData(this.lockedSession.id);
    if (!betBehind) {
      throw new RpcException('No bet behind configs');
    }
  }

  protected async handleEvent(): Promise<void> {
    if (this.lockedSession.totalStacksUsed >= this.roundLimit) {
      this.onRoundLimitReached();
      return;
    }
    const ctx: RoundContext = new RoundContext(
      this.lockedSession, this.cachedSession.queue, this.cachedMachine, this.cachedPlayer, this.cachedGroup,
      this.cachedOperator, false, null,
      this.correlationId);
    await this.roundServiceFactory
      .create(ctx, this.entityManager)
      .startRound(RoundType.BET_BEHIND)
      .catch(reason => {
        this.monitoringWorkerClient.sendAlertMessage({
          alertType: AlertType.WARNING,
          severity: AlertSeverity.HIGH,
          source: AlertSource.GAME_CORE,
          description: 'Wager call failed during BB round start',
          additionalInformation: {
            sessionId: this.lockedSession.id,
            machineId: ctx.machine.id,
            machineName: ctx.machine.name,
            machineSerial: ctx.machine.serial,
          },
        });
        this.logger.error('Wager call failed during BB round start:'
          + ` SessionId=${this.lockedSession.id}, correlationId=${this.correlationId}`, reason.stack);
        this.playerPublisher.sendNotification(this.lockedSession.id,
          {
            notificationId: NotificationType.BET_FAILED,
            title: 'Wallet error',
            message: 'Bet failed',
          });
        this.eventBus.finalizeSession({
          type: BusEventType.FINALIZE_SESSION,
          sessionId: this.lockedSession.id,
          terminate: true,
          reason: 'Transaction failed',
        }, this.correlationId);
        throw reason;
      });
  }

  private onRoundLimitReached() {
    this.logger.log(`Round limit reached. SessionId=${this.lockedSession.id}`);
    this.playerPublisher.sendNotification(this.lockedSession.id,
      {
        notificationId: NotificationType.ROUND_LIMIT_REACHED,
        title: 'Round limit reached!',
        message: 'You have reached the regulatory round limit, see you next time.',
      });
    this.eventBus.finalizeSession({
      type: BusEventType.FINALIZE_SESSION,
      sessionId: this.lockedSession.id,
      terminate: false,
      reason: 'Regulatory limit reached',
    }, this.correlationId);
  }
}

import { Injectable, Scope } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  MachineRepository,
  MachineStatus,
  SessionStatus,
} from 'arcadia-dal';
import { TransactionalHandler } from '../common/transactional.handler';
import { BusEventType } from '../event.bus/bus.event.type';
import { ChangeQueueEvent } from '../event.bus/dto/change.queue.event';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { AppLogger } from '../logger/logger.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';

@Injectable({ scope: Scope.REQUEST })
export class QueueChangeHandler extends TransactionalHandler<ChangeQueueEvent> {
  private ignoreMachines: number[];
  private ignoreGroups: number[];

  constructor(logger: AppLogger,
              @InjectRepository(MachineRepository, connectionNames.DATA)
              private readonly machineRepo: MachineRepository,
              private readonly monitoringService: MonitoringWorkerClientService,
              private readonly playerClientService: PlayerClientService,
              private readonly sessionDataManager: SessionDataManager,
              private readonly eventPublisher: EventBusPublisher,
  ) {
    super(logger);
  }

  protected async init(data: ChangeQueueEvent): Promise<void> {
    await super.init(data);

    this.ignoreMachines = data.ignoreMachines;
    this.ignoreGroups = data.ignoreGroups;
  }

  protected async handleEvent(): Promise<void> {
    const newMachine = await this.machineRepo.getShortestQueueMachine(
      this.cachedOperator.id, this.lockedSession.denominator, this.ignoreMachines, this.ignoreGroups,
    );
    if (!newMachine) {
      this.eventPublisher.finalizeSession({
        type: BusEventType.FINALIZE_SESSION,
        sessionId: this.lockedSession.id,
        terminate: true,
        reason: 'Machine change forced, no available machines',
      });
      return;
    }
    let status: SessionStatus;
    let buyDate = null;
    let roundsLeft = 0;
    switch (this.lockedSession.status) {
      case SessionStatus.QUEUE:
      case SessionStatus.QUEUE_BET_BEHIND:
      case SessionStatus.PLAYING:
      case SessionStatus.FORCED_AUTOPLAY:
      case SessionStatus.AUTOPLAY:
        status = SessionStatus.QUEUE;
        buyDate = new Date();
        if (this.lockedSession.roundsLeft <= 0) {
          roundsLeft = 1;
        }
        break;
      case SessionStatus.RE_BUY:
      case SessionStatus.VIEWER:
      case SessionStatus.VIEWER_BET_BEHIND:
        status = SessionStatus.VIEWER;
        roundsLeft = 0;
        buyDate = null;
        break;
      default:
    }
    await this.sessionRepo.update(this.lockedSession.id, {
      machine: newMachine,
      queue: newMachine.queue,
      group: newMachine.group,
      status,
      roundsLeft,
      buyDate,
      isDisconnected: true,
      lastDisconnectDate: new Date(),
    });
    await this.sessionDataManager.removeSessionData(
      { betBehind: {} as any, autoplay: {} as any }, this.lockedSession.id,
    );
    this.playerClientService.forceReconnect(this.lockedSession.id);
    this.monitoringService.sendEventLogMessage({
      eventType: EventType.SWITCH_QUEUE,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        machineSerial: newMachine.serial,
      },
    });
    this.eventPublisher.notifyQueueUpdate({
      type: BusEventType.QUEUE_UPDATES,
      queueId: Number(this.cachedSession.queue.id),
      session: this.cachedSession,
    }, this.correlationId);
    if (newMachine.status === MachineStatus.READY) {
      this.eventPublisher.engageNextSession(
        { type: BusEventType.ENGAGE_SESSION, machineId: newMachine.id }, this.correlationId,
      );
    }
  }
}

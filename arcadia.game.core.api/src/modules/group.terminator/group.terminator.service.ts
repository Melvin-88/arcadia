/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import {
  connectionNames,
  GroupRepository,
  GroupStatus,
  InjectRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
  QueueEntity,
  QueueRepository,
  QueueStatus,
  SessionEntity,
  SessionRepository,
  ShutdownReason,
} from 'arcadia-dal';
import { BusEventType } from '../event.bus/bus.event.type';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { AppLogger } from '../logger/logger.service';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { SessionService } from '../session/session.service';
import { WorkerClientService } from '../worker.client/worker.client.service';

@Injectable()
export class GroupTerminatorService {
  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    @InjectRepository(GroupRepository, connectionNames.DATA)
    private readonly groupRepo: GroupRepository,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    private readonly robotClient: RobotClientService,
    private readonly workerClient: WorkerClientService,
    private readonly operatorClient: OperatorApiClientService,
    private readonly monitoringWorkerClient: MonitoringWorkerClientService,
    private readonly logger: AppLogger,
    private readonly sessionService: SessionService,
    private readonly eventBusPublisher: EventBusPublisher,
  ) {
  }

  public async groupSoftStop(
    groupId: number, machineIds?: number[], correlationId?: string,
  ): Promise<void> {
    const machines = await this.machineRepo.getByGroupAndIds(groupId, machineIds);
    if (!machines?.length) {
      if (!machineIds?.length) {
        await this.groupRepo.update(groupId, { status: GroupStatus.OFFLINE });
      }
      this.logger.warn('No machines to stop on dry');
      return;
    }
    if (!machineIds?.length) {
      await this.groupRepo.update(groupId, { status: GroupStatus.DRYING });
    }
    const { toStop, toDry, toKick } = machines.reduce(
      (accum: { toDry: QueueEntity[]; toStop: MachineEntity[]; toKick: SessionEntity[]; }, machine) => {
        const { queue } = machine;
        if (!queue || queue.status === QueueStatus.DRYING || queue.status === QueueStatus.STOPPED) {
          return accum;
        }
        if (queue.sessions?.length) {
          const { active, kick } = queue.sessions.reduce(
            (acc: { active: SessionEntity[], kick: SessionEntity[] }, session) => {
              if (session.getActiveRound()) {
                acc.active.push(session);
              } else {
                acc.kick.push(session);
              }
              return acc;
            }, { active: [], kick: [] });
          if (active.length) {
            accum.toDry.push(queue);
          } else {
            accum.toStop.push(machine);
          }
          accum.toKick.push(...kick);
        } else {
          accum.toStop.push(machine);
        }
        return accum;
      }, { toDry: [], toStop: [], toKick: [] });
    if (toDry.length) {
      const queueIds = toDry.map(value => value.id);
      this.logger.log(`Start drying queues: ${JSON.stringify(queueIds)}; correlationId=${correlationId}`);
      await this.queueRepo.update(queueIds, { status: QueueStatus.DRYING });
    }
    if (toStop.length) {
      await this.queueRepo.update(toStop.map(machine => machine.queue.id),
        { status: QueueStatus.STOPPED });
      const machineIds = toStop.map(machine => machine.id);
      this.logger.log(`Stopping machines: ${JSON.stringify(machineIds)}, correlationId=${correlationId}`);
      await this.machineRepo.update(machineIds, {
        status: MachineStatus.SHUTTING_DOWN,
        shutdownReason: ShutdownReason.USER_REQUEST,
      });
      toStop.forEach(machine => this.robotClient.sendStopMessage(machine.serial));
    }
    toKick.forEach(session => {
      this.eventBusPublisher.queueChange({
        type: BusEventType.CHANGE_QUEUE,
        sessionId: session.id,
        ignoreMachines: machineIds,
        ignoreGroups: machineIds?.length ? undefined : [groupId],
      }, correlationId);
    });
  }

  public async groupHardStop(
    groupId: number, machineIds?: number[], correlationId?: string,
  ): Promise<void> {
    if (!machineIds?.length) {
      await this.groupRepo.update(groupId, { status: GroupStatus.OFFLINE });
    }
    const machines = await this.groupRepo.getGroupHardStopData(groupId, machineIds);
    if (!machines?.length) {
      this.logger.warn('No machines to stop on shutdown');
      return;
    }
    await this.queueRepo.update(machines.map(machine => machine.queue.id),
      { status: QueueStatus.STOPPED });

    const { toShutDown, sessions } = machines
      .reduce((acc: { toShutDown: MachineEntity[], sessions: SessionEntity[] }, machine) => {
        if (machine.status !== MachineStatus.STOPPED && machine.status !== MachineStatus.OFFLINE) {
          acc.toShutDown.push(machine);
        }
        if (machine.queue?.sessions?.length) {
          acc.sessions.push(...machine.queue.sessions);
        }
        return acc;
      }, { toShutDown: [], sessions: [] });
    if (toShutDown.length) {
      await this.machineRepo.update(toShutDown.map(machine => machine.id),
        { status: MachineStatus.SHUTTING_DOWN, shutdownReason: ShutdownReason.USER_REQUEST });
      toShutDown.forEach(machine => this.robotClient.sendStopMessage(machine.serial));
    }
    sessions.forEach(session => {
      this.workerClient.stopIdleTimeout(session.id, correlationId);
      this.workerClient.stopGraceTimeout(session.id, correlationId);
      this.eventBusPublisher.terminateSession({
        type: BusEventType.TERMINATE_SESSION,
        sessionId: session.id,
        correlationId,
      });
    });
  }
}

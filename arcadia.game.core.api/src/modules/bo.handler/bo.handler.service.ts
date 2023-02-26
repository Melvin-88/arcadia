/* eslint-disable max-lines */
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import {
  ChipRepository,
  ChipTypeRepository,
  connectionNames,
  GroupEntity,
  GroupRepository,
  InjectRepository,
  MachineDispenserRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  QueueStatus,
  RngChipPrizeRepository,
  SessionStatus,
  SiteRepository,
} from 'arcadia-dal';
import { ConfigValidator } from '../config.validator/configValidator';
import { BusEventType } from '../event.bus/bus.event.type';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { GroupTerminatorService } from '../group.terminator/group.terminator.service';
import { AppLogger } from '../logger/logger.service';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';
import { RobotMessageService } from '../messaging/robot.handling/robot.message.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { VideoApiClientService } from '../video.api.client/video.api.client.service';
import { VideoApiTokenResponse } from './bo.handler.interface';
import { MachineReassignDto } from './dto/machine.reassign.dto';
import { MachineStartDto } from './dto/machine.start.dto';
import { MachineStartResponseDto } from './dto/machine.start.response.dto';

@Injectable()
export class BoHandlerService {
  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    @InjectRepository(GroupRepository, connectionNames.DATA)
    private readonly groupRepo: GroupRepository,
    @InjectRepository(MachineDispenserRepository, connectionNames.DATA)
    private readonly dispenserRepo: MachineDispenserRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepo: ChipRepository,
    @InjectRepository(ChipTypeRepository, connectionNames.DATA)
    private readonly chipTypeRepo: ChipTypeRepository,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA)
    private readonly rngChipPrizeRepo: RngChipPrizeRepository,
    @InjectRepository(SiteRepository, connectionNames.DATA)
    private readonly siteRepo: SiteRepository,
    private readonly robotClient: RobotClientService,
    private readonly monitoringWorkerClient: MonitoringWorkerClientService,
    private readonly logger: AppLogger,
    private readonly robotMessaging: RobotMessageService,
    private readonly groupTerminator: GroupTerminatorService,
    private readonly eventBusPublisher: EventBusPublisher,
    private readonly videoApiService: VideoApiClientService,
    private readonly configValidator: ConfigValidator,
  ) {
  }

  public async groupSoftStopHandler(
    groupId: number, machineIds?: number[], correlationId?: string,
  ): Promise<void> {
    await this.groupTerminator.groupSoftStop(groupId, machineIds, correlationId);
  }

  public async groupHardStopHandler(
    groupId: number, machineIds?: number[], correlationId?: string,
  ): Promise<void> {
    await this.groupTerminator.groupHardStop(groupId, machineIds, correlationId);
  }

  public async machineStartHandler(
    machineId: number, params: MachineStartDto, correlationId?: string,
  ): Promise<MachineStartResponseDto> {
    const machine = await this.machineRepo.findOneOrFail(machineId, { relations: ['group'] });
    if (machine.status !== MachineStatus.OFFLINE && machine.status !== MachineStatus.ON_HOLD
      && machine.status !== MachineStatus.STOPPED) {
      throw new NotAcceptableException(`Machine (id=${machine.id}) can't be started from status: ${machine.status}`);
    }
    if (params.resetDispensers) {
      await this.dispenserRepo.delete({ machine: { id: machine.id } });
      await this.createDispensers(machine, machine.group);
    }
    if (params.resetTableState) {
      await this.resetTableState(machine.id);
    }
    await this.machineRepo.update(machine.id,
      { status: MachineStatus.STOPPED, shutdownReason: null });
    await this.monitoringWorkerClient.sendOutOfSessionEventLogMessage(machine.serial, {
      eventType: EventType.RUN,
      source: EventSource.GAME,
      params: {},
    });
    await this.robotClient
      .sendRobotMessage({ action: CoreMessage.RUN }, machine.serial);
    return { machineId, correlationId };
  }

  private async resetTableState(machineId: number) {
    await this.chipRepo.update({ machine: { id: machineId } },
      { machine: null, isScatter: false, value: 0 });
  }

  private async createDispensers(machine: MachineEntity, group: GroupEntity): Promise<void> {
    const config = await this.configValidator.getValidatedConfig(machine.serial);
    const prizes = await this.rngChipPrizeRepo.getAllPrizes(group.prizeGroup, config.rtpSegment);
    const chipTypes = new Map(prizes.map(value => [value.chipType.name, value.chipType]));
    const dispensers = Object.entries(config.dispensers)
      .map(([name, dispenser]) => this.dispenserRepo
        .create({
          name,
          machine,
          level: dispenser.capacity,
          capacity: dispenser.capacity,
          chipType: chipTypes.get(dispenser.chipType),
        }));
    if (dispensers?.length) {
      await this.dispenserRepo.save(dispensers, { reload: false, transaction: false });
    }
  }

  public async machineReassign(machineId: number, groupId: number): Promise<MachineReassignDto> {
    const [machine, toGroup] = await Promise.all([
      this.machineRepo.findOne(machineId,
        { relations: ['chips', 'chips.type', 'queue', 'queue.sessions', 'group'] }),
      this.groupRepo.findOne(groupId),
    ]);
    if (!machine) {
      throw new NotFoundException('Machine not found!');
    }
    if (!toGroup) {
      throw new NotFoundException('Group not found!');
    }
    if (machine.group.id === groupId) {
      throw new NotAcceptableException('Cant reassign to the same group!');
    }
    const { queue } = machine;
    if (queue.status === QueueStatus.DRYING
      || queue.status === QueueStatus.STOPPED
      || machine.status === MachineStatus.OFFLINE) {
      throw new NotAcceptableException('Machine/queue is down!');
    }
    const rngChipPrizes = await this.rngChipPrizeRepo
      .getAllPrizes(toGroup.prizeGroup, toGroup.configuration.rtpSegment);
    const prizes = new Set(rngChipPrizes.map(value => value.chipType.id));
    if (!machine.chips.every(chip => prizes.has(chip.type.id))) {
      this.logger.error(`Machine reassign failed. Incompatible target group by chip types! MachineId=${machineId}, groupId=${groupId}`);
      throw new NotAcceptableException('Incompatible group by chip types!');
    }
    await this.machineRepo.update(machine.id, { reassignTo: groupId });
    const activeStatuses = new Set([SessionStatus.PLAYING, SessionStatus.AUTOPLAY,
      SessionStatus.FORCED_AUTOPLAY, SessionStatus.QUEUE, SessionStatus.QUEUE_BET_BEHIND]);
    if (queue.sessions?.some(({ status }) => activeStatuses.has(status))) {
      await this.queueRepo.update(queue.id, { status: QueueStatus.DRYING });
    } else {
      await this.queueRepo.update(queue.id, { status: QueueStatus.STOPPED });
      await this.robotMessaging.reassignMachine(machineId);
    }
    return { groupId };
  }

  public async machineReboot(machineId: number): Promise<any> {
    const machine = await this.machineRepo.findOneOrFail(machineId, { relations: ['group'] });
    if (machine.status === MachineStatus.IN_PLAY) {
      throw new NotAcceptableException(`Unsafe reboot from status: ${machine.status}`);
    }
    await this.groupTerminator.groupHardStop(machine.group.id, [machine.id]);
    this.robotClient.sendRobotMessage({ action: CoreMessage.REBOOT }, machine.serial);
    return { machineId };
  }

  public async terminateSession(sessionId: number, correlationId: string): Promise<number> {
    await this.eventBusPublisher.terminateSession({
      type: BusEventType.TERMINATE_SESSION,
      sessionId,
      correlationId,
      terminate: true,
    });

    return sessionId;
  }

  public async getVideoApiToken(siteId: number): Promise<VideoApiTokenResponse> {
    const site = await this.siteRepo.findOne(siteId);
    if (!site) {
      throw new NotFoundException('Site with provided id not found');
    }
    const token = await this.videoApiService.getApiToken(site);
    return { token };
  }
}

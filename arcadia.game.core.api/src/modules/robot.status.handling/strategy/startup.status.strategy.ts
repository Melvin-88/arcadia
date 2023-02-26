import { Injectable } from '@nestjs/common';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  ChipRepository,
  connectionNames,
  InjectRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  QueueStatus,
} from 'arcadia-dal';
import * as moment from 'moment';
import { ConfigValidator } from '../../config.validator/configValidator';
import { ConfigService } from '../../config/config.service';
import { AppLogger } from '../../logger/logger.service';
import { CoreMessage } from '../../messaging/robot.handling/enum/core.message';
import { RobotMessageService } from '../../messaging/robot.handling/robot.message.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { StatusHandlerStrategy } from './status.handler.strategy';

@Injectable()
export class StartupStatusStrategy extends StatusHandlerStrategy {
  private readonly offlineThresholdSec: number;

  constructor(
    logger: AppLogger,
    configService: ConfigService,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepo: ChipRepository,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    private readonly robotClientService: RobotClientService,
    private readonly robotMessageService: RobotMessageService,
    private readonly monitoringWorkerClient: MonitoringWorkerClientService,
    private readonly configValidator: ConfigValidator) {
    super(logger);
    this.offlineThresholdSec = Number(configService
      .get(['core', 'ROBOT_OFFLINE_DURATION_THRESHOLD_SEC']));
  }

  public async onIdle(machine: MachineEntity): Promise<void> {
    await this.queueRepo.update({ machine }, { status: QueueStatus.READY });
    await this.robotMessageService.seeding(machine.serial);
  }

  public async onTesting(machine: MachineEntity): Promise<void> {
    await this.machineRepo.update(machine.id,
      { status: MachineStatus.PREPARING, shutdownReason: null });
  }

  public async onStopped(machine: MachineEntity): Promise<void> {
    await this.configValidator.dropCache(machine.serial);
    if (machine.shutdownReason
      || (machine.pingDate
        && moment().diff(machine.pingDate, 'seconds') > this.offlineThresholdSec)) {
      await this.machineRepo.update(machine.id, { status: MachineStatus.ON_HOLD });
      this.logger.log(`Machine on hold. machineId: ${machine.id}, reason: ${machine.shutdownReason || 'unknown'}`);
      await this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.INFORMATION,
        severity: AlertSeverity.LOW,
        source: AlertSource.GAME_CORE,
        description: 'Machine on hold',
        additionalInformation: {
          shutdownReason: machine.shutdownReason || 'unknown',
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      return;
    }
    await this.machineRepo.update(machine.id,
      { status: MachineStatus.STOPPED, startedDate: new Date() });
    await this.robotClientService
      .sendRobotMessage({ action: CoreMessage.RUN }, machine.serial);
    await this.monitoringWorkerClient.sendOutOfSessionEventLogMessage(machine.serial, {
      eventType: EventType.RUN,
      source: EventSource.GAME,
      params: {},
    });
  }

  public toString(): string {
    return StartupStatusStrategy.name;
  }
}
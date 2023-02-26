import { Injectable } from '@nestjs/common';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  connectionNames,
  InjectRepository,
  MachineRepository,
  MachineStatus,
} from 'arcadia-dal';
import { GroupTerminatorService } from '../group.terminator/group.terminator.service';
import { AppLogger } from '../logger/logger.service';
import { RobotErrorMessage } from '../messaging/robot.handling/dto/robotErrorMessage';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { RobotError } from './robotError';

@Injectable()
export class RobotErrorHandler {
  constructor(
    private readonly logger: AppLogger,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    private readonly groupTerminator: GroupTerminatorService,
    private readonly monitoringClient: MonitoringWorkerClientService,
  ) {
  }

  public async handleError(errorMessage: RobotErrorMessage): Promise<void> {
    const {
      serial, module, error, details, correlationId,
    } = errorMessage;
    const machine = await this.machineRepo.findOneOrFail({ serial },
      { relations: ['group'] });
    let description = 'Machine error';
    switch (error) {
      case RobotError.DISPENSING_FAILED:
        if (machine.status === MachineStatus.SEEDING) {
          await this.groupTerminator
            .groupHardStop(machine.group.id, [machine.id], correlationId);
        }
        description = 'Machine dispensing failure';
        break;
      // todo: how to handle?
      case RobotError.MOTOR_FAILURE:
        description = 'Dispenser motor failure';
        break;
      case RobotError.NO_ENGAGEMENT:
        await this.monitoringClient.sendEventLogMessage({
          eventType: EventType.LOST_CONNECTION,
          source: EventSource.ROBOT,
          params: {
            sessionId: details.session,
            machineSerial: machine.serial,
          },
        });
        break;
      case RobotError.DOOR_OPENED:
        description = 'Cabinet door opened';
        break;
      default:
        await this.groupTerminator
          .groupHardStop(machine.group.id, [machine.id], correlationId);
    }
    this.monitoringClient.sendAlertMessage({
      alertType: AlertType.ALERT,
      severity: AlertSeverity.HIGH,
      source: AlertSource.GAME_CORE,
      description,
      additionalInformation: {
        machineId: machine.id,
        machineName: machine.name,
        machineSerial: machine.serial,
        module,
        error,
        details,
      },
    });
  }
}
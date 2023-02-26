import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { connectionNames, InjectRepository, MachineRepository } from 'arcadia-dal';
import { AppLogger } from '../logger/logger.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { RobotReportedStatus } from './robot.reported.status';
import { StatusStrategyFactory } from './strategy/status.strategy.factory';

@Injectable()
export class StatusHandlerService {
  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    private readonly statusStrategyFactory: StatusStrategyFactory,
    private readonly logger: AppLogger,
    private readonly monitoringService: MonitoringWorkerClientService,
  ) {
  }

  public async handleStatus(status: RobotReportedStatus, serial: string): Promise<void> {
    const machine = await this.machineRepo.findOneOrFail({ serial },
      { relations: ['group'] })
      .catch(reason => {
        throw new RpcException(reason);
      });
    this.logger.log(`Status handling. On robot: ${status}, on server: ${machine.status},  machineId=${machine.id}`);
    const strategy = this.statusStrategyFactory.getStrategy(machine, status);
    this.logger.log(`Status handling strategy: ${strategy.toString()}, machineId=${machine.id}`);
    switch (status) {
      case RobotReportedStatus.STOPPED:
        await strategy.onStopped(machine);
        break;
      case RobotReportedStatus.TESTING:
        await strategy.onTesting(machine);
        break;
      case RobotReportedStatus.IDLE:
        await strategy.onIdle(machine);
        break;
      case RobotReportedStatus.STOPPING:
        await this.monitoringService.sendEventLogMessage({
          eventType: EventType.STOPPING,
          source: EventSource.ROBOT,
          params: {
            machineSerial: serial,
          },
        });
        await strategy.onStopping(machine);
        break;
      case RobotReportedStatus.SEEDING:
        await strategy.onSeeding(machine);
        break;
      case RobotReportedStatus.MANUAL_PLAY:
      case RobotReportedStatus.AUTO_PLAY:
      default:
        this.logger.log(`No handler for status: ${status}`);
    }
    await this.machineRepo.update(machine.id, { pingDate: new Date() });
  }
}
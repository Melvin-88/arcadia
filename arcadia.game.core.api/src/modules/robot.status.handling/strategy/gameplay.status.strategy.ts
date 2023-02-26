import { Injectable } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
} from 'arcadia-dal';
import { BusEventType } from '../../event.bus/bus.event.type';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { AppLogger } from '../../logger/logger.service';
import { RobotReportedStatus } from '../robot.reported.status';
import { StatusHandlerStrategy } from './status.handler.strategy';

@Injectable()
export class GameplayStatusStrategy extends StatusHandlerStrategy {
  constructor(logger: AppLogger,
              @InjectRepository(MachineRepository, connectionNames.DATA)
              private readonly machineRepo: MachineRepository,
              private readonly eventBus: EventBusPublisher,
  ) {
    super(logger);
  }

  public async onIdle(machine: MachineEntity): Promise<void> {
    if (machine.status === MachineStatus.SEEDING) {
      await this.machineRepo.update(machine.id, { status: MachineStatus.READY });
      this.eventBus.engageNextSession({
        type: BusEventType.ENGAGE_SESSION,
        machineId: machine.id,
      });
    }
  }

  public async onSeeding(machine: MachineEntity): Promise<void> {
    if (machine.status !== MachineStatus.SEEDING) {
      this.throwUnexpectedStatus(RobotReportedStatus.SEEDING, machine);
    }
  }

  public toString(): string {
    return GameplayStatusStrategy.name;
  }
}
import { Injectable } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
} from 'arcadia-dal';
import { ConfigValidator } from '../../config.validator/configValidator';
import { AppLogger } from '../../logger/logger.service';
import { StatusHandlerStrategy } from './status.handler.strategy';

@Injectable()
export class ShutdownStatusStrategy extends StatusHandlerStrategy {
  constructor(logger: AppLogger,
              @InjectRepository(MachineRepository, connectionNames.DATA)
              private readonly machineRepo: MachineRepository,
              private readonly configValidator: ConfigValidator) {
    super(logger);
  }

  public async onStopping(machine: MachineEntity): Promise<void> {
    if (machine.status !== MachineStatus.SHUTTING_DOWN) {
      await this.machineRepo.update(machine.id, { status: MachineStatus.SHUTTING_DOWN });
    }
  }

  public async onStopped(machine: MachineEntity): Promise<void> {
    await this.machineRepo.update(machine.id, { status: MachineStatus.STOPPED });
    await this.configValidator.dropCache(machine.serial);
    // todo: notify machine shutdown complete
  }

  public toString(): string {
    return ShutdownStatusStrategy.name;
  }
}
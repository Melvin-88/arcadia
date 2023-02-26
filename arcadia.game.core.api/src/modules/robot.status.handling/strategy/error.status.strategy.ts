import { Injectable } from '@nestjs/common';
import { MachineEntity } from 'arcadia-dal';
import { GroupTerminatorService } from '../../group.terminator/group.terminator.service';
import { AppLogger } from '../../logger/logger.service';
import { StatusHandlerStrategy } from './status.handler.strategy';

@Injectable()
export class ErrorStatusStrategy extends StatusHandlerStrategy {
  constructor(logger: AppLogger,
              private readonly groupTerminator: GroupTerminatorService) {
    super(logger);
  }

  async onIdle(machine: MachineEntity): Promise<void> {
    await this.groupTerminator.groupHardStop(machine.group.id, [machine.id]);
  }

  async onTesting(machine: MachineEntity): Promise<void> {
    await this.groupTerminator.groupHardStop(machine.group.id, [machine.id]);
  }

  async onStopping(machine: MachineEntity): Promise<void> {
    await this.groupTerminator.groupHardStop(machine.group.id, [machine.id]);
  }

  async onStopped(machine: MachineEntity): Promise<void> {
    await this.groupTerminator.groupHardStop(machine.group.id, [machine.id]);
  }

  public toString(): string {
    return ErrorStatusStrategy.name;
  }
}
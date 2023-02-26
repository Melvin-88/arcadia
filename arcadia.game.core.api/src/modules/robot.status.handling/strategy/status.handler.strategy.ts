import { RpcException } from '@nestjs/microservices';
import { MachineEntity } from 'arcadia-dal';
import { AppLogger } from '../../logger/logger.service';
import { RobotReportedStatus } from '../robot.reported.status';

export abstract class StatusHandlerStrategy {
  protected constructor(protected readonly logger: AppLogger) {
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async onStopped(machine: MachineEntity): Promise<void> {
    this.throwUnexpectedStatus(RobotReportedStatus.STOPPED, machine);
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async onTesting(machine: MachineEntity): Promise<void> {
    this.throwUnexpectedStatus(RobotReportedStatus.TESTING, machine);
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async onStopping(machine: MachineEntity): Promise<void> {
    this.throwUnexpectedStatus(RobotReportedStatus.STOPPING, machine);
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async onIdle(machine: MachineEntity): Promise<void> {
    this.throwUnexpectedStatus(RobotReportedStatus.IDLE, machine);
  }

  public async onManualPlay(machine: MachineEntity): Promise<void> {
    this.logger.log(`On manual-play status: machineId=${machine.id}`);
  }

  public async onAutoPlay(machine: MachineEntity): Promise<void> {
    this.logger.log(`On auto-play status: machineId=${machine.id}`);
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async onSeeding(machine: MachineEntity): Promise<void> {
    this.throwUnexpectedStatus(RobotReportedStatus.SEEDING, machine);
  }

  public abstract toString(): string;

  protected throwUnexpectedStatus(status: RobotReportedStatus, machine: MachineEntity): never {
    throw new RpcException(`Unexpected status! Strategy: ${this.toString()}, status: ${status}, machineId: ${machine.id}`);
  }
}
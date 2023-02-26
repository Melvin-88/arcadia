import { Injectable } from '@nestjs/common';
import { MachineEntity, MachineStatus } from 'arcadia-dal';
import { RobotReportedStatus } from '../robot.reported.status';
import { ErrorStatusStrategy } from './error.status.strategy';
import { GameplayStatusStrategy } from './gameplay.status.strategy';
import { ShutdownStatusStrategy } from './shutdown.status.strategy';
import { StartupStatusStrategy } from './startup.status.strategy';
import { StatusHandlerStrategy } from './status.handler.strategy';

@Injectable()
export class StatusStrategyFactory {
  constructor(private readonly startupStrategy: StartupStatusStrategy,
              private readonly shutdownStrategy: ShutdownStatusStrategy,
              private readonly errorStrategy: ErrorStatusStrategy,
              private readonly gameplayStrategy: GameplayStatusStrategy) {
  }

  public getStrategy(machine: MachineEntity, robotStatus: RobotReportedStatus): StatusHandlerStrategy {
    const { status: machineStatus } = machine;
    let strategy: StatusHandlerStrategy;
    switch (robotStatus) {
      case RobotReportedStatus.STOPPED:
        if (machineStatus === MachineStatus.SHUTTING_DOWN) {
          strategy = this.shutdownStrategy;
        } else if (machineStatus === MachineStatus.OFFLINE
          || machineStatus === MachineStatus.STOPPED
          || machineStatus === MachineStatus.ON_HOLD) {
          strategy = this.startupStrategy;
        } else {
          strategy = this.errorStrategy;
        }
        break;
      case RobotReportedStatus.TESTING:
        if (machineStatus === MachineStatus.STOPPED) {
          strategy = this.startupStrategy;
        } else {
          strategy = this.errorStrategy;
        }
        break;
      case RobotReportedStatus.SEEDING:
        if (machineStatus === MachineStatus.SEEDING) {
          strategy = this.gameplayStrategy;
        } else {
          strategy = this.errorStrategy;
        }
        break;
      case RobotReportedStatus.IDLE:
        if (machineStatus === MachineStatus.PREPARING) {
          strategy = this.startupStrategy;
        } else if (machineStatus === MachineStatus.READY
          || machineStatus === MachineStatus.SEEDING
          || MachineStatus.IN_PLAY) {
          strategy = this.gameplayStrategy;
        } else {
          strategy = this.errorStrategy;
        }
        break;
      case RobotReportedStatus.STOPPING:
        strategy = this.shutdownStrategy;
        break;
      case RobotReportedStatus.MANUAL_PLAY:
      case RobotReportedStatus.AUTO_PLAY:
        if (machineStatus === MachineStatus.IN_PLAY || machineStatus === MachineStatus.READY) {
          strategy = this.gameplayStrategy;
        } else {
          strategy = this.errorStrategy;
        }
        break;
      default:
        strategy = this.errorStrategy;
    }
    return strategy;
  }
}
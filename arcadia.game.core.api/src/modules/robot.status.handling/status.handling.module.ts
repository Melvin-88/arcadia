import { Module } from '@nestjs/common';
import {
  ChipRepository,
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  MachineRepository,
  QueueRepository,
} from 'arcadia-dal';
import { ConfigValidatorModule } from '../config.validator/configValidatorModule';
import { GroupTerminatorModule } from '../group.terminator/group.terminator.module';
import { MessagingModule } from '../messaging/messaging.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { RobotClientModule } from '../robot.client/robot.client.module';
import { SessionModule } from '../session/session.module';
import { StatusHandlerController } from './status.handler.controller';
import { StatusHandlerService } from './status.handler.service';
import { ErrorStatusStrategy } from './strategy/error.status.strategy';
import { GameplayStatusStrategy } from './strategy/gameplay.status.strategy';
import { ShutdownStatusStrategy } from './strategy/shutdown.status.strategy';
import { StartupStatusStrategy } from './strategy/startup.status.strategy';
import { StatusStrategyFactory } from './strategy/status.strategy.factory';

@Module({
  imports: [SessionModule, MonitoringWorkerClientModule, RobotClientModule, MessagingModule,
    GroupTerminatorModule, ConfigValidatorModule],
  providers: [
    StatusStrategyFactory, StatusHandlerService, StartupStatusStrategy, ShutdownStatusStrategy,
    ErrorStatusStrategy, GameplayStatusStrategy,
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(QueueRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [StatusHandlerController],
})
export class StatusHandlingModule {

}
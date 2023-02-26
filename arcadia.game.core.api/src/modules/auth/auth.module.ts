import { Module } from '@nestjs/common';
import {
  connectionNames,
  CurrencyConversionRepository,
  getConnectionToken,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  OperatorRepository,
  PlayerRepository,
  RngChipPrizeRepository,
  SessionRepository,
} from 'arcadia-dal';
import { ConfigValidatorModule } from '../config.validator/configValidatorModule';
import { IpCheckerModule } from '../ip.checker/ip.checker.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { RobotClientModule } from '../robot.client/robot.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { SessionModule } from '../session/session.module';
import { VideoApiClientModule } from '../video.api.client/video.api.client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SessionModule,
    OperatorApiClientModule,
    VideoApiClientModule,
    RobotClientModule,
    MonitoringWorkerClientModule,
    SessionDataManagerModule,
    IpCheckerModule,
    ConfigValidatorModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(GroupRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(OperatorRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(OperatorRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(CurrencyConversionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RngChipPrizeRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
})
export class AuthModule {
}

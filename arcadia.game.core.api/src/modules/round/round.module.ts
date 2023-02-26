import { Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  PlayerRepository,
  RoundRepository,
  SessionRepository,
} from 'arcadia-dal';
import { BalanceNotifierModule } from '../balance.notifier/balance.notifier.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { RngServiceClientModule } from '../rng.service.client/rng.service.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { RoundServiceFactory } from './round.service.factory';

@Module({
  imports: [RngServiceClientModule, MonitoringWorkerClientModule, OperatorApiClientModule,
    BalanceNotifierModule, SessionDataManagerModule],
  providers: [RoundServiceFactory,
    {
      provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  exports: [RoundServiceFactory],
})
export class RoundModule {

}
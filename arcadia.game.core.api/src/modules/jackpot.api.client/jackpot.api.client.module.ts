import { HttpModule, Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  RoundRepository,
  SessionRepository,
} from 'arcadia-dal';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { WorkerClientModule } from '../worker.client/worker.client.module';
import { JackpotApiClientController } from './jackpot.api.client.controller';
import { JackpotApiClientService } from './jackpot.api.client.service';

@Module({
  imports: [HttpModule, WorkerClientModule, OperatorApiClientModule,
    MonitoringWorkerClientModule, SessionDataManagerModule,
  ],
  controllers: [JackpotApiClientController],
  providers: [JackpotApiClientService,
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  exports: [JackpotApiClientService],
})
export class JackpotApiClientModule {

}
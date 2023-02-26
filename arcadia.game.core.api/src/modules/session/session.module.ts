import { Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  SessionArchiveRepository,
  SessionRepository,
} from 'arcadia-dal';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [SessionDataManagerModule, MonitoringWorkerClientModule],
  providers: [
    SessionService,
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionArchiveRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionArchiveRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {
}

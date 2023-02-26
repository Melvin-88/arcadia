import { Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  MachineRepository,
  QueueRepository,
  SessionRepository,
} from 'arcadia-dal';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { SessionModule } from '../session/session.module';
import { VideoApiClientModule } from '../video.api.client/video.api.client.module';
import { QueueChangeHandler } from './queue.change.handler';
import { QueueController } from './queue.controller';
import { QueueManagerService } from './queue.manager.service';
import { QueueTransactionController } from './queue.transaction.controller';

@Module({
  imports: [SessionModule, VideoApiClientModule, MonitoringWorkerClientModule, SessionDataManagerModule],
  providers: [QueueManagerService, QueueChangeHandler,
    {
      provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(QueueRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [QueueController, QueueTransactionController],
  exports: [QueueManagerService],
})
export class QueueManagerModule {

}

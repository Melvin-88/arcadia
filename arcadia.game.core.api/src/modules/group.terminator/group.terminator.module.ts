import { Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  QueueRepository,
  SessionRepository,
} from 'arcadia-dal';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { PlayerClientModule } from '../player.client/player.client.module';
import { RobotClientModule } from '../robot.client/robot.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { SessionModule } from '../session/session.module';
import { WorkerClientModule } from '../worker.client/worker.client.module';
import { GroupTerminatorService } from './group.terminator.service';
import { SessionTerminator } from './session.terminator';
import { TerminatorController } from './terminator.controller';

@Module({
  imports: [OperatorApiClientModule, SessionModule, WorkerClientModule,
    MonitoringWorkerClientModule, RobotClientModule, SessionDataManagerModule, PlayerClientModule],
  controllers: [TerminatorController],
  providers: [GroupTerminatorService, SessionTerminator,
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
      provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(GroupRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  exports: [GroupTerminatorService],
})
export class GroupTerminatorModule {

}
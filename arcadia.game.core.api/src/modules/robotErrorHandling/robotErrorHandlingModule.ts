import { Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  MachineRepository,
} from 'arcadia-dal';
import { GroupTerminatorModule } from '../group.terminator/group.terminator.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { RobotErrorController } from './robotErrorController';
import { RobotErrorHandler } from './robotErrorHandler';

@Module({
  imports: [GroupTerminatorModule, MonitoringWorkerClientModule],
  providers: [RobotErrorHandler,
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [RobotErrorController],
  exports: [RobotErrorHandler],
})
export class RobotErrorHandlingModule {

}
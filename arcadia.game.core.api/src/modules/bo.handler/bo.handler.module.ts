import { Module } from '@nestjs/common';
import {
  ChipRepository,
  ChipTypeRepository,
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  GroupRepository,
  MachineDispenserRepository,
  MachineRepository,
  QueueRepository,
  RngChipPrizeRepository,
  SiteRepository,
} from 'arcadia-dal';
import { ConfigValidatorModule } from '../config.validator/configValidatorModule';
import { GroupTerminatorModule } from '../group.terminator/group.terminator.module';
import { MessagingModule } from '../messaging/messaging.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { RobotClientModule } from '../robot.client/robot.client.module';
import { VideoApiClientModule } from '../video.api.client/video.api.client.module';
import { BoHandlerController } from './bo.handler.controller';
import { BoHandlerService } from './bo.handler.service';

@Module({
  imports: [MonitoringWorkerClientModule, RobotClientModule, MessagingModule, GroupTerminatorModule,
    VideoApiClientModule, ConfigValidatorModule],
  controllers: [BoHandlerController],
  providers: [BoHandlerService,
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
      provide: getRepositoryToken(MachineDispenserRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineDispenserRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipTypeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipTypeRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RngChipPrizeRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SiteRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SiteRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  exports: [BoHandlerService],
})
export class BoHandlerModule {

}
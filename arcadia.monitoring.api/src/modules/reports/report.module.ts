import { Module } from '@nestjs/common';
import {
  ActivityReportRepository,
  connectionNames,
  DisputesReportRepository,
  FunnelReportRepository,
  getConnectionToken,
  getRepositoryToken,
  PlayerStatsReportRepository,
  RetentionReportRepository,
  MachineStatusReportRepository,
  RevenueReportRepository,
  VouchersReportRepository,
  ProcessedReportRepository,
  PlayerBlocksReportRepository,
} from 'arcadia-dal';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { WorkerClientModule } from '../worker.client/worker.client.module';

@Module({
  imports: [WorkerClientModule],
  exports: [],
  providers: [
    ReportService,
    {
      provide: getRepositoryToken(ActivityReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ActivityReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerStatsReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerStatsReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RevenueReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RevenueReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(VouchersReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(VouchersReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(DisputesReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(DisputesReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RetentionReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RetentionReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(FunnelReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(FunnelReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineStatusReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineStatusReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ProcessedReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ProcessedReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerBlocksReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerBlocksReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [
    ReportController,
  ],
})
export class ReportModule {}

import { CacheModule, HttpModule, Module } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  SessionArchiveRepository,
  getConnectionToken,
  TypeOrmModule,
  ActivityReportRepository,
  RevenueReportRepository,
  DisputesReportRepository,
  DisputeRepository,
  PlayerStatsReportRepository,
  RetentionReportRepository,
  MachineStatusHistoryRepository,
  PlayerRepository,
  FunnelReportRepository,
  VouchersReportRepository,
  VoucherRepository,
  MachineStatusReportRepository,
  ProcessedReportRepository,
  PlayerBlocksReportRepository,
  ChangeRepository,
  MachineRepository,
} from 'arcadia-dal';
import { ActivityReportStrategy } from './strategies/activity.report.strategy';
import { ConfigService } from '../config/config.service';
import { ReportsService } from './reports.service';
import { ReportStrategyFactory } from './strategies/report.strategy.factory';
import { PlayerStatsReportStrategy } from './strategies/player.stats.report.strategy';
import { RevenueReportStrategy } from './strategies/revenue.report.strategy';
import { VouchersReportStrategy } from './strategies/vouchers.report.strategy';
import { DisputesReportStrategy } from './strategies/disputes.report.strategy';
import { FunnelReportStrategy } from './strategies/funnel.report.strategy';
import { MachineStatusReportStrategy } from './strategies/machine.status.report.strategy';
import { PlayerBlocksReportStrategy } from './strategies/player.blocks.report.strategy';
import { RetentionReportStrategy } from './strategies/retention.report.strategy';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async configService => ({
        baseURL: `http://${configService.get(['core', 'MONITORING_API_HOST'])}:${configService.get(['core', 'MONITORING_API_PORT'])}`,
        timeout: 3000,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => config.get('redisconfig'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ChangeRepository,
    ], connectionNames.AUDIT),
  ],
  exports: [
    ActivityReportStrategy,
    PlayerStatsReportStrategy,
    RevenueReportStrategy,
    VouchersReportStrategy,
    FunnelReportStrategy,
    ReportsService,
    ReportStrategyFactory,
    DisputesReportStrategy,
    MachineStatusReportStrategy,
    RetentionReportStrategy,
  ],
  providers: [
    ActivityReportStrategy,
    PlayerStatsReportStrategy,
    RevenueReportStrategy,
    ReportsService,
    ReportStrategyFactory,
    VouchersReportStrategy,
    DisputesReportStrategy,
    FunnelReportStrategy,
    MachineStatusReportStrategy,
    PlayerBlocksReportStrategy,
    RetentionReportStrategy,
    {
      provide: getRepositoryToken(SessionArchiveRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionArchiveRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
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
      provide: getRepositoryToken(VoucherRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(VoucherRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(DisputesReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(DisputesReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(DisputeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(DisputeRepository),
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
      provide: getRepositoryToken(MachineStatusHistoryRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineStatusHistoryRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ProcessedReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ProcessedReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerBlocksReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerBlocksReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChangeRepository, connectionNames.AUDIT),
      useFactory: connection => connection.getCustomRepository(ChangeRepository),
      inject: [getConnectionToken(connectionNames.AUDIT)],
    },
  ],
  controllers: [],
})
export class ReportsModule {
}

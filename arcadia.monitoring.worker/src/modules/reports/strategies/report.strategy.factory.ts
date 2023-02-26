import { Injectable } from '@nestjs/common';
import { ReportTypes } from 'arcadia-dal';
import { ActivityReportStrategy } from './activity.report.strategy';
import { AbstractReportStrategy } from './abstract.report.strategy';
import { PlayerStatsReportStrategy } from './player.stats.report.strategy';
import { RevenueReportStrategy } from './revenue.report.strategy';
import { DisputesReportStrategy } from './disputes.report.strategy';
import { FunnelReportStrategy } from './funnel.report.strategy';
import { VouchersReportStrategy } from './vouchers.report.strategy';
import { MachineStatusReportStrategy } from './machine.status.report.strategy';
import { PlayerBlocksReportStrategy } from './player.blocks.report.strategy';
import { RetentionReportStrategy } from './retention.report.strategy';

@Injectable()
export class ReportStrategyFactory {
  constructor(
    private readonly activityReportStrategy: ActivityReportStrategy,
    private readonly playerStatsReportStrategy: PlayerStatsReportStrategy,
    private readonly revenueReportStrategy: RevenueReportStrategy,
    private readonly vouchersReportStrategy: VouchersReportStrategy,
    private readonly disputesReportStrategy: DisputesReportStrategy,
    private readonly funnelReportStrategy: FunnelReportStrategy,
    private readonly machineStatusReportStrategy: MachineStatusReportStrategy,
    private readonly playerBlocksReportStrategy: PlayerBlocksReportStrategy,
    private readonly retentionReportStrategy: RetentionReportStrategy,
  ) {
  }

  public getStrategy(reportType: ReportTypes): AbstractReportStrategy {
    switch (reportType) {
      case ReportTypes.ACTIVITY:
        return this.activityReportStrategy;
      case ReportTypes.PLAYER_STATS:
        return this.playerStatsReportStrategy;
      case ReportTypes.REVENUE:
        return this.revenueReportStrategy;
      case ReportTypes.VOUCHERS:
        return this.vouchersReportStrategy;
      case ReportTypes.DISPUTES:
        return this.disputesReportStrategy;
      case ReportTypes.FUNNEL:
        return this.funnelReportStrategy;
      case ReportTypes.MACHINE_STATUS:
        return this.machineStatusReportStrategy;
      case ReportTypes.PLAYER_BLOCKS:
        return this.playerBlocksReportStrategy;
      case ReportTypes.RETENTION:
        return this.retentionReportStrategy;
      default:
        throw new Error('Unknown strategy');
    }
  }
}

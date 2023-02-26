import { BinaryBoolean, ICommonRequestFiltersParams } from 'arcadia-common-fe';
import { IProcessedReportsReducer } from './modules/processedReports/types';
import { IActivityReportReducer } from './modules/activity/types';
import { IPlayerStatsReportReducer } from './modules/playerStats/types';
import { IVouchersReportReducer } from './modules/vouchers/types';
import { IDisputesReportReducer } from './modules/disputes/types';
import { IPlayerBlocksReportReducer } from './modules/playerBlocks/types';
import { IMachineStatusReportReducer } from './modules/machineStatus/types';
import { IRetentionReportReducer } from './modules/retention/types';
import { IFunnelReportReducer } from './modules/funnel/types';
import { IRevenueReportReducer } from './modules/revenue/types';
import {
  ActivityReportGroupingKeys,
  DisputesReportGroupingKeys,
  FunnelReportGroupingKeys,
  MachineStatusReportGroupingKeys,
  PlayerBlocksReportGroupingKeys,
  RevenueReportGroupingKeys,
  PlayerStatsReportGroupingKeys,
  VouchersReportGroupingKeys,
  RetentionReportGroupingKeys,
} from './components/ReportsGroupByField/types';
import { DisputesReportState } from './modules/disputes/components/DisputesReportFilters/DisputesReportState/DisputesReportState';

export enum ReportType {
  activity = 'activity',
  playerStats = 'player-stats',
  vouchers = 'vouchers',
  disputes = 'disputes',
  playerBlocks = 'player-blocks',
  machineStatus = 'machine-status',
  retention = 'retention',
  funnel = 'funnel',
  revenue = 'revenue'
}

export interface IReportInfo {
  available: number
  inProgress: number
  toCreate: number
}
// TODO: This interface should be reviewed to avoid types conflicts (Alex Kolesnikov)
export interface IReportsFiltersPanelValues {
  startDate?: string
  endDate?: string
  groupBy?: (
    ActivityReportGroupingKeys | DisputesReportGroupingKeys | FunnelReportGroupingKeys |
    MachineStatusReportGroupingKeys | PlayerBlocksReportGroupingKeys | PlayerStatsReportGroupingKeys |
    RetentionReportGroupingKeys | RevenueReportGroupingKeys | VouchersReportGroupingKeys
  )
  filterByDate?: DisputesReportState
  siteId?: number[]
  groupName?: string[]
  machineId?: string
  denomination?: string[]
  newPlayersOnly?: BinaryBoolean
  cid?: string[]
}

export interface IReportResponseBody<TReportData> {
  total: number
  info: IReportInfo
  data: TReportData
}

export interface IReportsReducer {
  readonly reportType: null | string
}

export interface IGetProcessedReportRequestFiltersParams extends ICommonRequestFiltersParams, IReportsFiltersPanelValues {
}

export interface IReportsSlice {
  rootReportsReducer: {
    reportsReducer: IReportsReducer
    processedReportsReducer: IProcessedReportsReducer
    activityReportReducer: IActivityReportReducer
    playerStatsReportReducer: IPlayerStatsReportReducer
    vouchersReportReducer: IVouchersReportReducer
    disputesReportReducer: IDisputesReportReducer
    playerBlocksReportReducer: IPlayerBlocksReportReducer
    machineStatusReportReducer: IMachineStatusReportReducer
    retentionReportReducer: IRetentionReportReducer
    funnelReportReducer: IFunnelReportReducer
    revenueReportReducer: IRevenueReportReducer
  }
}

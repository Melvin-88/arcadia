import {
  ActivityReportGroupingKeys,
  DisputesReportGroupingKeys,
  FunnelReportGroupingKeys,
  MachineStatusReportGroupingKeys,
  PlayerBlocksReportGroupingKeys,
  PlayerStatsReportGroupingKeys,
  RetentionReportGroupingKeys,
  RevenueReportGroupingKeys,
  VouchersReportGroupingKeys,
} from './types';

export const activityReportGroupingKeysLabelMap: { [key in ActivityReportGroupingKeys]: string } = {
  [ActivityReportGroupingKeys.operator]: 'Operator',
  [ActivityReportGroupingKeys.site]: 'Site',
  [ActivityReportGroupingKeys.group]: 'Group',
  [ActivityReportGroupingKeys.machine]: 'Machine',
  [ActivityReportGroupingKeys.month]: 'Month',
  [ActivityReportGroupingKeys.denomination]: 'Denomination',
  [ActivityReportGroupingKeys.day]: 'Day',
};

export const disputesReportGroupingKeysLabelMap: { [key in DisputesReportGroupingKeys]: string } = {
  [DisputesReportGroupingKeys.operator]: 'Operator',
  [DisputesReportGroupingKeys.player]: 'Player',
  [DisputesReportGroupingKeys.status]: 'Status',
  [DisputesReportGroupingKeys.month]: 'Month',
  [DisputesReportGroupingKeys.day]: 'Day',
};

export const funnelReportGroupingKeysLabelMap: { [key in FunnelReportGroupingKeys]: string } = {
  [FunnelReportGroupingKeys.operator]: 'Operator',
  [FunnelReportGroupingKeys.site]: 'Site',
  [FunnelReportGroupingKeys.group]: 'Group',
  [FunnelReportGroupingKeys.machine]: 'Machine',
  [FunnelReportGroupingKeys.month]: 'Month',
  [FunnelReportGroupingKeys.denomination]: 'Denomination',
  [FunnelReportGroupingKeys.day]: 'Day',
};

export const machineStatusReportGroupingKeysLabelMap: { [key in MachineStatusReportGroupingKeys]: string } = {
  [MachineStatusReportGroupingKeys.operator]: 'Operator',
  [MachineStatusReportGroupingKeys.site]: 'Site',
  [MachineStatusReportGroupingKeys.group]: 'Group',
  [MachineStatusReportGroupingKeys.machine]: 'Machine',
  [MachineStatusReportGroupingKeys.month]: 'Month',
  [MachineStatusReportGroupingKeys.denomination]: 'Denomination',
  [MachineStatusReportGroupingKeys.day]: 'Day',
  [MachineStatusReportGroupingKeys.status]: 'Status',
};

export const playerBlocksReportGroupingKeysLabelMap: { [key in PlayerBlocksReportGroupingKeys]: string } = {
  [PlayerBlocksReportGroupingKeys.operator]: 'Operator',
  [PlayerBlocksReportGroupingKeys.day]: 'Day',
  [PlayerBlocksReportGroupingKeys.month]: 'Month',
  [PlayerBlocksReportGroupingKeys.reason]: 'Reason',
};

export const playerStatsReportGroupingKeysLabelMap: { [key in PlayerStatsReportGroupingKeys]: string } = {
  [PlayerStatsReportGroupingKeys.player]: 'Player',
};

export const retentionReportGroupingKeysLabelMap: { [key in RetentionReportGroupingKeys]: string } = {
  [RetentionReportGroupingKeys.operator]: 'Operator',
  [RetentionReportGroupingKeys.month]: 'Month',
  [RetentionReportGroupingKeys.denomination]: 'Denomination',
  [RetentionReportGroupingKeys.day]: 'Day',
};

export const revenueReportGroupingKeysLabelMap: { [key in RevenueReportGroupingKeys]: string } = {
  [RevenueReportGroupingKeys.operator]: 'Operator',
  [RevenueReportGroupingKeys.site]: 'Site',
  [RevenueReportGroupingKeys.group]: 'Group',
  [RevenueReportGroupingKeys.machine]: 'Machine',
  [RevenueReportGroupingKeys.month]: 'Month',
  [RevenueReportGroupingKeys.denomination]: 'Denomination',
  [RevenueReportGroupingKeys.day]: 'Day',
  [RevenueReportGroupingKeys.currency]: 'Currency',
};

export const vouchersReportGroupingKeysLabelMap: { [key in VouchersReportGroupingKeys]: string } = {
  [VouchersReportGroupingKeys.operator]: 'Operator',
  [VouchersReportGroupingKeys.day]: 'Day',
  [VouchersReportGroupingKeys.month]: 'Month',
  [VouchersReportGroupingKeys.denomination]: 'Denomination',
  [VouchersReportGroupingKeys.player]: 'Player',
};

import React, { useMemo } from 'react';
import { Select, IFormFieldProps } from 'arcadia-common-fe';
import { ReportType } from '../../types';
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
import {
  activityReportGroupingKeysLabelMap,
  disputesReportGroupingKeysLabelMap,
  funnelReportGroupingKeysLabelMap,
  machineStatusReportGroupingKeysLabelMap,
  playerBlocksReportGroupingKeysLabelMap,
  playerStatsReportGroupingKeysLabelMap,
  retentionReportGroupingKeysLabelMap,
  revenueReportGroupingKeysLabelMap,
  vouchersReportGroupingKeysLabelMap,
} from './constants';

interface IReportsGroupByFieldProps extends IFormFieldProps {
  reportType: null | string
  isRequired?: boolean
}

export const ReportsGroupByField: React.FC<IReportsGroupByFieldProps> = ({
  className,
  reportType,
  label = 'Group By',
  ...restProps
}) => {
  const options = useMemo(() => {
    switch (reportType) {
      case ReportType.activity:
        return Object.values(ActivityReportGroupingKeys).map((key) => (
          { value: key, label: activityReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.disputes:
        return Object.values(DisputesReportGroupingKeys).map((key) => (
          { value: key, label: disputesReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.funnel:
        return Object.values(FunnelReportGroupingKeys).map((key) => (
          { value: key, label: funnelReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.machineStatus:
        return Object.values(MachineStatusReportGroupingKeys).map((key) => (
          { value: key, label: machineStatusReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.playerBlocks:
        return Object.values(PlayerBlocksReportGroupingKeys).map((key) => (
          { value: key, label: playerBlocksReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.playerStats:
        return Object.values(PlayerStatsReportGroupingKeys).map((key) => (
          { value: key, label: playerStatsReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.retention:
        return Object.values(RetentionReportGroupingKeys).map((key) => (
          { value: key, label: retentionReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.revenue:
        return Object.values(RevenueReportGroupingKeys).map((key) => (
          { value: key, label: revenueReportGroupingKeysLabelMap[key] }
        ));
      case ReportType.vouchers:
        return Object.values(VouchersReportGroupingKeys).map((key) => (
          { value: key, label: vouchersReportGroupingKeysLabelMap[key] }
        ));
      default:
        return [];
    }
  }, [reportType]);

  return (
    <Select
      name="groupBy"
      label={label}
      isClearable
      options={options}
      {...restProps}
    />
  );
};

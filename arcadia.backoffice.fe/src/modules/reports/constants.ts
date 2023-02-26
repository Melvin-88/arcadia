import { ITEMS_PER_PAGE, SortOrder } from 'arcadia-common-fe';
import { ReportType } from './types';

export const reportsListLabelMap: { [key in ReportType]: string } = {
  [ReportType.activity]: 'Activity',
  [ReportType.playerStats]: 'Player stats',
  [ReportType.vouchers]: 'Vouchers',
  [ReportType.disputes]: 'Disputes',
  [ReportType.playerBlocks]: 'Player blocks',
  [ReportType.machineStatus]: 'Machine status',
  [ReportType.retention]: 'Retention',
  [ReportType.funnel]: 'Funnel',
  [ReportType.revenue]: 'Revenue',
};

export const defaultReportFilters = {
  offset: 0,
  take: ITEMS_PER_PAGE,
  sortOrder: SortOrder.asc,
  sortBy: 'grouping_value',
};

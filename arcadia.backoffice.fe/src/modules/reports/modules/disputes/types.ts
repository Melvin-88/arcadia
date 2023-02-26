import { IReportResponseBody } from '../../types';

export interface IDisputesReportItem {
  grouping_value: string
  total_dispute_count: number
}

export type IDisputesReport = IDisputesReportItem[];

export interface IGetDisputesReportResponseBody extends IReportResponseBody<IDisputesReport> {
}

export interface IDisputesReportReducer extends IGetDisputesReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

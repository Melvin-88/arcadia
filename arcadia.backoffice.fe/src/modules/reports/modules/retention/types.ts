import { IReportResponseBody } from '../../types';

export interface IRetentionReportItem {
  grouping_value: string
  r1: number
  r2: number
  r7: number
  r14: number
  r30: number
}

export type IRetentionReport = IRetentionReportItem[];

export interface IGetRetentionReportResponseBody extends IReportResponseBody<IRetentionReport> {
}

export interface IRetentionReportReducer extends IGetRetentionReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

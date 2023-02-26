import { IReportResponseBody } from '../../types';

export interface IPlayerBlocksReportItem {
  grouping_value: string
  total_blocked: number
  total_unblocked: number
}

export type IPlayerBlocksReport = IPlayerBlocksReportItem[];

export interface IGetPlayerBlocksReportResponseBody extends IReportResponseBody<IPlayerBlocksReport> {
}

export interface IPlayerBlocksReportReducer extends IGetPlayerBlocksReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

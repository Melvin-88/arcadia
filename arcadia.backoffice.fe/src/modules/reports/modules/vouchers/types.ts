import { IReportResponseBody } from '../../types';

export interface IVouchersReportItem {
  grouping_value: string
  total_vouchers_issued: number
  total_vouchers_used: number
  total_vouchers_bets: number
  total_vouchers_wins: number
  total_vouchers_expired: number
  total_vouchers_canceled: number
  total_rounds_played: number
}

export type IVouchersReport = IVouchersReportItem[];

export interface IGetVouchersReportResponseBody extends IReportResponseBody<IVouchersReport> {
}

export interface IVouchersReportReducer extends IGetVouchersReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

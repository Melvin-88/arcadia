import { IReportResponseBody } from '../../types';

export interface IRevenueReportItem {
  grouping_value: string
  total_unique_players: number
  total_new_players: number
  total_bets: number
  total_wins: number
  total_voucher_bets: number
  total_voucher_wins: number
  total_refunds: number
  total_gross_gaming: number
  total_net_gaming: number
  arpu: number
}

export type IRevenueReport = IRevenueReportItem[];

export interface IGetRevenueReportResponseBody extends IReportResponseBody<IRevenueReport> {
}

export interface IRevenueReportReducer extends IGetRevenueReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

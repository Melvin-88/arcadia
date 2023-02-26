import { IReportResponseBody } from '../../types';

export interface IPlayerStatsReportItem {
  grouping_value: string
  total_unique_sessions: number
  total_session_time: number
  avg_session_time: number
  total_rounds_played: number
  avg_rounds_per_session: number
  total_bets: number
  total_wins: number
  total_behind_bets: number
  total_behind_wins: number
  total_voucher_bets: number
  total_voucher_wins: number
  total_refunds: number
  total_gross_gaming: number
  total_net_gaming: number
  total_watch_time: number
  avg_watch_time: number
  max_watch_time: number
  total_queue_time: number
  avg_queue_time: number
  max_queue_time: number
  total_in_play_time: number
  avg_in_play_time: number
  max_in_play_time: number
  total_autoplay_bets: number
  total_autoplay_wins: number
  percent_autoplay_sessions: number
  total_sessions_watch: number
  percent_sessions_watch: number
  total_sessions_queue: number
  percent_sessions_queue: number
  total_sessions_behind: number
  percent_sessions_behind: number
  total_sessions_in_play: number
  percent_sessions_in_play: number
  ltv: number
}

export type IPlayerStatsReport = IPlayerStatsReportItem[];

export interface IGetPlayerStatsReportResponseBody extends IReportResponseBody<IPlayerStatsReport> {
}

export interface IPlayerStatsReportReducer extends IGetPlayerStatsReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

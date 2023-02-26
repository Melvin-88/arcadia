import { IReportResponseBody } from '../../types';

export interface IFunnelReportItem {
  grouping_value: string
  total_unique_players: number
  total_unique_sessions: number
  total_session_time: number
  avg_session_time: number
  total_rounds_played: number
  avg_rounds_per_session: number
  total_watch_time: number
  avg_watch_time: number
  max_watch_time: number
  total_queue_time: number
  avg_queue_time: number
  max_queue_time: number
  total_in_play_time: number
  avg_in_play_time: number
  max_in_play_time: number
  total_sessions_watch: number
  percent_sessions_watch: number
  total_sessions_queue: number
  percent_sessions_queue: number
  total_sessions_behind: number
  percent_sessions_behind: number
  total_sessions_in_play: number
  percent_sessions_in_play: number
  total_sessions_change_denomination: number
  percent_sessions_change_denomination: number
}

export type IFunnelReport = IFunnelReportItem[];

export interface IGetFunnelReportResponseBody extends IReportResponseBody<IFunnelReport> {
}

export interface IFunnelReportReducer extends IGetFunnelReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

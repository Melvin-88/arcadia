import { IReportResponseBody } from '../../types';

export interface IMachineStatusReportItem {
  grouping_value: string
  total_machines: number
  total_available_time: number
  percent_available_time: number
  total_in_play_time: number
  percent_in_play_time: number
  total_error_time: number
  percent_error_time: number
  total_offline_time: number
  percent_offline_time: number
  total_stopped_time: number
  percent_stopped_time: number
  total_shutting_down_time: number
  percent_shutting_down_time: number
  total_preparing_time: number
  percent_preparing_time: number
  total_ready_time: number
  percent_ready_time: number
  total_seeding_time: number
  percent_seeding_time: number
  total_on_hold_time: number
  percent_on_hold_time: number
}

export type IMachineStatusReport = IMachineStatusReportItem[];

export interface IGetMachineStatusReportResponseBody extends IReportResponseBody<IMachineStatusReport> {
}

export interface IMachineStatusReportReducer extends IGetMachineStatusReportResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
}

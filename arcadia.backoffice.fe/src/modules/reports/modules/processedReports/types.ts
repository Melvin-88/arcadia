import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum ReportStatus {
  pending = 'pending',
  inProgress = 'in_progress',
  ready = 'ready',
  error = 'error',
}

export interface IGetProcessedReportsFilterParams {
  filterParams?: ICommonRequestFiltersParams
  reportType: string
}

export interface IProcessedReportsRequestFiltersParams extends ICommonRequestFiltersParams {
}

export interface IProcessedReport {
  reportType: string
  params: IProcessedReportsRequestFiltersParams
  requestedDateTime: string
  status: ReportStatus
}

export type IProcessedReports = IProcessedReport[];

export interface IGetProcessedReportsResponseBody {
  data: IProcessedReports
  total: number
}

export interface IProcessedReportsState extends IGetProcessedReportsResponseBody {
  isOpen: boolean
}

export interface IProcessedReportsReducer extends IProcessedReportsState {
  readonly isLoading: boolean
  readonly filterParams: IProcessedReportsRequestFiltersParams
}

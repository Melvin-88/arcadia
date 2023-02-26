import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum SessionStatus {
  viewer = 'viewer',
  playing = 'playing',
  autoplay = 'autoplay',
  queue = 'queue',
  terminating = 'terminating',
  completed = 'completed',
  terminated = 'terminated',
  forcedAutoplay = 'forcedAutoplay',
  viewerBetBehind = 'viewerBetBehind',
  queueBetBehind = 'queueBetBehind',
  reBuy = 'reBuy',
}

export enum SessionLogSource {
  player = 'player',
  robot = 'robot',
  game = 'game',
}

export type SessionId = number;

export interface ISession {
  id: SessionId
  status: SessionStatus
  groupName: string
  machineId: number
  operatorName: string
  playerCid: string
  ip: string
  startDate: string
  duration: number
  rounds: number
  totalWinning: number
  totalNetCash: number
  viewerDuration: number
  queueDuration: number
  totalBets: number
  totalStacksUsed: number
  currency: string
  clientVersion: string
  os: string
  deviceType: string
  browser: string
  groupDetails: string
  operationDetails: string
  systemConfigs: string
  videoUrl: string
  operatorSettings: {}
  groupSettings: {}
  systemSettings: {}
}

export type ISessions = ISession[];

export interface ISessionsFiltersPanelValues {
  id?: SessionId
  status?: SessionStatus | SessionStatus[]
  groupName?: string
  machineId?: number
  operatorName?: string
  playerCid?: string
  startDateFrom?: string
  startDateTo?: string
  durationFrom?: number
  durationTo?: number
  roundsFrom?: number
  roundsTo?: number
  totalWinningFrom?: number
  totalWinningTo?: number
  totalNetCashFrom?: number
  totalNetCashTo?: number
}

export interface IGetSessionsRequestFiltersParams extends ICommonRequestFiltersParams, ISessionsFiltersPanelValues {
}

export interface IGetSessionsResponseBody {
  total: number
  sessions: ISessions
}

export interface ISessionLogItem {
  createdDate: string
  source: SessionLogSource
  type: string
  parameters: object
}

export type ISessionLogs = ISessionLogItem[];

export interface ISessionLogsFiltersPanelValues {
  dateFrom?: string
  dateTo?: string
  type?: string
  source?: string
}

export interface IGetLogsRequestFiltersParams extends ICommonRequestFiltersParams, ISessionLogsFiltersPanelValues {
}

export interface ISessionLogsDialog {
  session: null | ISession
  isOpen: boolean
  isLoading: boolean
  isExporting: boolean
  total: number
  logs: ISessionLogs
  filterParams: IGetLogsRequestFiltersParams
}

export interface IDialogTerminate {
  isOpen: boolean
  isLoading?: boolean
  id: number | null
}

export interface ISessionsReducer extends IGetSessionsResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogLogs: ISessionLogsDialog
  readonly dialogTerminate: IDialogTerminate
}

export interface ISessionsSlice {
  sessionsReducer: ISessionsReducer
}

export interface IGetSessionLogsRequestBody {
  session: ISession
  filterParams: IGetLogsRequestFiltersParams
}

export interface IExportSessionLogsRequestBody {
  session: ISession
  filterParams: IGetLogsRequestFiltersParams
}

export interface IGetSessionLogsResponseBody {
  total: number
  logs: ISessionLogs
}

export interface ITerminateSessionRequestBody {
  id: number | null
}

export interface IOpenTerminateDialog {
  id: number | null
}

import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum HistoryType {
  alerts = 'alerts',
  administration = 'administration',
  groups = 'groups',
  machines = 'machines',
  vouchers = 'vouchers',
  operators = 'operators',
  disputes = 'disputes',
  maintenance = 'maintenance',
  monitoring = 'monitoring',
  players = 'players',
  sessions = 'sessions',
}

export interface IHistory {
  date: string
  action: string
  user: {
    id: number
    email: string
    name: string
  },
  previousData: {},
  newData: {},
}

export type IHistoryList = IHistory[];

export interface IHistoryFiltersPanelValues {
  startDate?: string
  endDate?: string
}

export interface IGetHistoryRequestFiltersParams extends ICommonRequestFiltersParams, IHistoryFiltersPanelValues {
}

export type HistoryId = number | string;

export interface IGetHistoryRequestBody {
  id: HistoryId
  historyType: HistoryType
  filterParams?: IHistoryFiltersPanelValues
}

export interface IGetHistoryResponseBody {
  total: number
  history: IHistoryList
}

export interface IHistoryReducer {
  id: HistoryId
  isOpen: boolean
  isLoading: boolean
  total: number
  history: IHistoryList
  filterParams: IGetHistoryRequestFiltersParams
  historyType?: HistoryType
}

export interface IHistorySlice {
  historyReducer: IHistoryReducer
}

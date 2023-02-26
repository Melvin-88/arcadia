import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum PlayerStatus {
  active = 'active',
  inPlay = 'in-play',
  blocked = 'blocked'
}

export enum PlayerAction {
  block,
  unblock
}

export type PlayerCID = string;

export interface IPlayer {
  cid: PlayerCID
  operatorName: string
  currency: string
  status: PlayerStatus
  bets: number
  wins: number
  netCash: number
  createdDate: string
  lastSessionDate: string
  blockReason: string
  settings: {}
  connectedMachines: string[]
}

export type IPlayers = IPlayer[];

export interface IPlayersFiltersPanelValues {
  cid?: PlayerCID
  status?: PlayerStatus[]
  operatorName?: string
  betsFrom?: number
  betsTo?: number
  winsFrom?: number
  winsTo?: number
  netCashFrom?: number
  netCashTo?: number
  lastSessionDateFrom?: string
  lastSessionDateTo?: string
  createdDateFrom?: string
  createdDateTo?: string
}

export interface IGetPlayersRequestFilterParams extends ICommonRequestFiltersParams, IPlayersFiltersPanelValues {
}

export interface IGetPlayersResponseBody extends ICommonRequestFiltersParams {
  total: number
  players: IPlayers
}

export interface IPlayerActionRequestBody {
  id: string
  reason?: string
}

export interface IDialogActionState {
  id: string
  action: PlayerAction
  isOpen: boolean
  isLoading?: boolean
}

export interface IPlayersReducer extends IGetPlayersResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogAction: IDialogActionState
}

export interface IPlayersSlice {
  playersReducer: IPlayersReducer
}

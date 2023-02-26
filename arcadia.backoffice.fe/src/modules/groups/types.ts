import { ICommonRequestFiltersParams, INormalizedEntities } from 'arcadia-common-fe';
import { BinaryBoolean } from '../../types/api';

export enum GroupColorId {
  darkBlue = 'darkBlue',
  lightGreen = 'lightGreen',
  mentolGreen = 'mentolGreen',
  orange = 'orange',
  red = 'red',
  purple = 'purple',
  yellow = 'yellow',
}

export enum GroupStatus {
  idle = 'idle',
  inPlay = 'in-play',
  drying = 'drying',
  shuttingDown = 'shutting-down',
  offline = 'offline',
}

export enum GroupAction {
  activate,
  dry,
  shutdown,
  remove,
}

export interface IGroup {
  id: number
  status: GroupStatus
  name: string
  color: GroupColorId
  blueRibbonGameId: null | string
  denominator: number
  machinesIdle: number
  machinesTotal: number
  totalPowerLineA: number
  totalPowerLineB: number
  stackCoinsSize: number
  idleTimeout: number
  stackBuyLimit: number
  graceTimeout: number
  isPrivate: boolean
  hasJackpot: boolean
  operators: boolean
  regulation: {}
  configuration: {}
}

export type IGroups = IGroup[];

export interface IPostGroupRequestBody extends IGroup {
  prizeGroup: string
  password: string
}

export interface IGroupsFiltersPanelValues {
  id?: number | number[]
  status?: GroupStatus[]
  name?: string
  machinesTotal?: number
  machinesIdle?: number
  denominator?: number
  hasJackpot?: BinaryBoolean
  operators?: BinaryBoolean
}

export interface IGetGroupsRequestFiltersParams extends ICommonRequestFiltersParams, IGroupsFiltersPanelValues {
}

export type GroupId = number;

export type IGroupsEntities = INormalizedEntities<IGroup, GroupId>;

export interface IGroupsNormalizedData {
  total: number
  entities: IGroupsEntities
  ids: GroupId[]
}

export interface IGetGroupsResponseBody {
  total: number
  groups: IGroups
}

export interface IPutGroupRequestBody extends IGroup {
  prizeGroup: string
  password: string
}

export interface IGroupActionRequestBody {
  id: string
  password: string
}

export interface IGroupDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  initialValues?: IGroup
}

export interface IGroupDialogActionState {
  id: number | null
  action: GroupAction
  isOpen: boolean
  isLoading?: boolean
}

export interface IGroupsReducer extends IGroupsNormalizedData {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IGroupDialogFormState
  readonly dialogAction: IGroupDialogActionState
}

export interface IGroupsSlice {
  groupsReducer: IGroupsReducer
}

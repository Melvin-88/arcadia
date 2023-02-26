import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum AdministrationUserStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

export enum AdministrationAction {
  enable,
  disable,
  remove,
}

export interface IAdministrationFiltersPanelValues {
  id?: number
  status?: AdministrationUserStatus[]
  lastAccessIp?: string
  lastAccessDateTo?: string
  lastAccessDateFrom?: string
  userName?: string
  isAdmin?: boolean
}

export interface IGetAdministrationRequestFiltersParams extends ICommonRequestFiltersParams, IAdministrationFiltersPanelValues {
}

export type UserId = number;

export interface IUser {
  id: number
  status: AdministrationUserStatus
  isAdmin: boolean
  userName: string
  firstName: string
  lastName: string
  lastAccessDate: string
  lastAccessIp: string
  phone1: string
  phone2: string
  email: string
  permittedModules: number[]
}

export type IUsers = IUser[];

export interface IChip {
  rfid: number
  typeId: number
  value: number
  siteId: number
  status: string
}

export type IChips = IChip[];

interface UserActionChanges {
  action: string
  previousData: {}
  newData: {}
}

export interface UserAction {
  id: string
  path: string
  ip: string
  date: string
  changes: UserActionChanges[]
}

export type UserActions = UserAction[];

export interface IGetAdministrationResponseBody {
  total: number
  users: IUsers
}

export interface IGetChipsResponseBody {
  chips: IChips
}

export interface IUserActionsResponseBody {
  total: number
  actions: UserActions
}

export interface IPostAdministrationRequestBody extends IUser {
  password: string
}

export interface IPutAdministrationRequestBody extends IUser {
  password: string
}

export interface IEnableUserRequestBody {
  id: string
  password: string
}

export interface IDisableUserRequestBody {
  id: string
  password: string
}

export interface IRemoveUserRequestBody {
  id: string
  password: string
}

export interface IAdministrationActionRequestBody {
  id: string
  password: string
}

export interface IFindChipPayload {
  term: string
}

export interface IFilterParamsUserActions extends ICommonRequestFiltersParams {
}

export interface IGetUserActionsPayload {
  id: number
  filterParams: Partial<IFilterParamsUserActions>
}

export interface IAdministrationEditPasswordRequestBody {
  id: UserId
  currentUsersPassword: string
  password: string
}

export interface IRegisterChipsRequestBody {
  fromRFID: string
  toRFID: string
  typeId: number
  value: number
  siteId: number
  machineId: number
}

export interface IDisqualifyChipsPayload {
  fromRFID: string
  toRFID: string
}

export interface IAdministrationDialogEditPassword {
  id: number | null
  isOpen: boolean
  isLoading?: boolean
}

export interface IAdministrationDialogRegisterChips {
  isOpen: boolean
  isLoading?: boolean
}

export interface IAdministrationDialogDisqualifyChips {
  isOpen: boolean
  isLoading?: boolean
}

export interface IAdministrationDialogFindChip {
  isOpen: boolean
  total: number
  chips: IChips
  isLoading?: boolean
}

export type UserActionId = string;

export interface IAdministrationDialogUserActions {
  id: UserId
  isLoading: boolean
  isExporting: boolean
  filterParams: IFilterParamsUserActions
  total: number
  actions: UserActions
  isOpen: boolean
}

export interface IAdministrationDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  initialValues?: IUser
}

export interface IAdministrationDialogActionState {
  id: number | null
  action: AdministrationAction
  isOpen: boolean
  isLoading?: boolean
}

export interface IAdministrationReducer extends IGetAdministrationResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IAdministrationDialogFormState
  readonly dialogAction: IAdministrationDialogActionState
  readonly dialogEditPassword: IAdministrationDialogEditPassword
  readonly dialogRegisterChips: IAdministrationDialogRegisterChips
  readonly dialogDisqualifyChips: IAdministrationDialogDisqualifyChips
  readonly dialogFindChip: IAdministrationDialogFindChip
  readonly dialogUserActions: IAdministrationDialogUserActions
}

export interface IAdministrationSlice {
  administrationReducer: IAdministrationReducer
}

import { INormalizedEntities, PermissionId } from 'arcadia-common-fe';

export enum UserPermissions {
  dashboard = 1,
  sessions = 2,
  players = 3,
  groups = 4,
  machines = 5,
  vouchers = 6,
  operators = 7,
  reports = 8,
  alerts = 9,
  disputes = 10,
  monitoring = 11,
  administration = 12,
  cameras = 13,
  maintenance = 14,
  jackpots = 15,
}

export interface IPermission {
  id: PermissionId
  name: string
}

export type IPermissionsEntities = INormalizedEntities<IPermission, PermissionId>;

type IPermissions = IPermission[];

export interface IGetPermissionsResponseBody {
  permissions: IPermissions
}

export type IGetUserPermissionsResponseBody = IPermission[];

export interface IAuthReducer {
  readonly isLoading: boolean
  readonly isPermissionsLoading: boolean
  readonly token: string | null
  readonly user: IUserData
  readonly permissionsIds: PermissionId[]
  readonly permissionsEntities: IPermissionsEntities
  readonly userPermissions: PermissionId[]
}

export interface IUserData {
  firstName: string
  lastName: string
  email: string
}

export interface IAuthStoreSlice {
  authReducer: IAuthReducer
}

export interface ISignInRequestBody {
  email: string
  password: string
}

export interface ISignInResponseBody {
  token: string
  user: IUserData
}

export interface IPermissionsData {
  permissionsIds: PermissionId[]
  permissionsEntities: IPermissionsEntities
  userPermissions: PermissionId[]
}

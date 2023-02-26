import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum OperatorStatus {
  disabled = 'disabled',
  enabled = 'enabled'
}

export enum OperatorAction {
  enable,
  disable,
  remove,
}

export interface IOperatorsFiltersPanelValues {
  id?: string
  status?: OperatorStatus[]
  operatorName?: string
}

export type OperatorId = number;

export interface IOperator {
  id: OperatorId
  status: OperatorStatus
  name: string
  logoUrl: string
  apiConnectorId: string
  apiAccessToken: string
  apiTokenExpirationDate: string
  regulation: object
  configuration: object
  linkToGroups: number[]
  linkToVouchers: number[]
  activeSessionsCount: number
  blueRibbonOperatorId: string
  voucherPortalUsername: string
}

export type IOperators = IOperator[];

export interface IPostOperatorRequestBody extends IOperator {
  password: string
  voucherPortalPassword: string
}

export interface IPutOperatorRequestBody extends IOperator {
  password: string
  voucherPortalPassword: string
}

export interface IPostOperatorResponseBody extends IOperator {
}

export interface IPutOperatorResponseBody extends IOperator {
}

export interface ILogoOperatorUploadResponseBody {
  id: number
  url: string
}

export interface IExecuteOperatorResponseBody extends IOperator {
}

export interface IGetOperatorsRequestFilterParams extends ICommonRequestFiltersParams, IOperatorsFiltersPanelValues {
}

export interface IGetOperatorsResponseBody {
  total: number
  operators: IOperators
}

export interface IOperatorFormValues extends Omit<IPostOperatorRequestBody | IPutOperatorRequestBody, 'regulation' | 'configuration'> {
  regulation: string | {}
  configuration: string | {}
}

export interface IOperatorDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  isUploadingLogo: boolean
  initialValues?: Partial<IOperatorFormValues | IOperator>
  logoUrl?: string | null
}

export interface IOperatorsReducer extends IGetOperatorsResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IOperatorDialogFormState
  readonly dialogAction: IOperatorDialogActionState
}

export interface IOperatorsSlice {
  operatorsReducer: IOperatorsReducer
}

export interface IOperatorActionRequestBody {
  id: string
  password: string
}

export type ILogoOperatorUploadRequestBody = FormData;

export interface IOperatorDialogActionState {
  id: number | null
  action: OperatorAction
  isOpen: boolean
  isLoading?: boolean
}

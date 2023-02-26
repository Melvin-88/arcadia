import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum DisputeStatus {
  open = 'open',
  inquiring = 'inquiring',
  closed = 'closed',
}

export interface IDispute {
  id: number
  status: DisputeStatus
  operatorName: string
  operatorId: number
  playerCid: string
  sessionId: number
  rebateSum: number
  rebateCurrency: string
  openedAtDate: string
  closedDate: string
  complaint: string
  discussion: string
}

export type IDisputes = IDispute[];

export interface IDisputesFiltersPanelValues {
}

export interface IGetDisputesRequestFiltersParams extends ICommonRequestFiltersParams, IDisputesFiltersPanelValues {
}

export interface IPutDisputeRequestBody extends IDispute {
}

export interface IPostDisputeRequestBody extends IDispute {
}

export interface IGetDisputesResponseBody {
  total: number
  disputes: IDisputes
}

export interface IDisputesDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  initialValues?: Partial<IDispute>
}

export interface IDisputesReducer extends IGetDisputesResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IDisputesDialogFormState
}

export interface IDisputesSlice {
  disputesReducer: IDisputesReducer
}

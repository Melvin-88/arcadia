import { IGetVouchersResponseBody, IVoucher } from 'arcadia-common-fe';

export interface IDashboardStatisticsResponseBody {
  inPending: string
  usedInLast24Hours: string
  usedInLast7Days: string
  usedInLast30Days: string
}

interface IDashboardStatistics extends Partial<IDashboardStatisticsResponseBody> {
  isLoading: boolean
}

export interface IDashboardSlice {
  dashboardReducer: IDashboardReducer
}

export interface IPostVouchersResponseBody extends IVoucher {
}

export interface IPostVoucherRequestBody {
  groupName: string
  expirationDate: string
  playerCid: string[]
}

export interface IVoucherDialogFormState {
  isOpen: boolean
  isLoading?: boolean
}

export interface IDashboardReducer extends IGetVouchersResponseBody {
  readonly isVouchersLoading: boolean
  readonly isVouchersExporting: boolean
  readonly statistics: IDashboardStatistics
  readonly voucherDialogForm: IVoucherDialogFormState
}

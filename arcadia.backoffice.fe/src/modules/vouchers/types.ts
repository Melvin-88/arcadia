import {
  ISelectedVouchers, IVouchersNormalizedData, VoucherID,
} from 'arcadia-common-fe';

export interface IVoucherRevokeRequest {
  id: VoucherID
  reason: string
  password: string
}

export interface IVouchersRevoke {
  ids: VoucherID[]
  reason: string
  password: string
}

export interface IVouchersRevokeDialog {
  isOpen: boolean,
  isLoading: boolean,
}

export interface IVouchersReducer extends IVouchersNormalizedData {
  readonly isLoading: boolean
  readonly selectedVouchers: ISelectedVouchers
  readonly isExporting: boolean
  readonly dialogRevoke: IVouchersRevokeDialog
}

export interface IVouchersSlice {
  vouchersReducer: IVouchersReducer
}

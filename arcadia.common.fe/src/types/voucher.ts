import { INormalizedEntities } from './entities';
import { ICommonRequestFiltersParams } from './general';

export enum VoucherStatus {
  pending = 'pending',
  used = 'used',
  revoked = 'revoked',
  expired = 'expired',
}

export type VoucherID = string;

export interface IVoucher {
  id: VoucherID,
  status: VoucherStatus,
  operatorName: string,
  playerCid: string,
  groupName: string,
  sessionId: number,
  grantedDate: string,
  expirationDate: string,
  revocationReason: string
}

export type IVouchers = IVoucher[];

export type IVouchersEntities = INormalizedEntities<IVoucher, VoucherID>;

export interface IVouchersNormalizedData {
  total: number
  entities: IVouchersEntities
  ids: VoucherID[]
}

export type ISelectedVouchers = VoucherID[];

export interface IVouchersFiltersPanelValues {
  id?: VoucherID | VoucherID[]
  status?: VoucherStatus[]
  expirationDateFrom?: string
  expirationDateTo?: string
  grantedDateFrom?: string
  grantedDateTo?: string
  playerCid?: string
  operatorName?: string
  groupName?: string
}

export interface IGetVouchersRequestFiltersParams extends ICommonRequestFiltersParams, IVouchersFiltersPanelValues {
}

export interface IGetVouchersResponseBody {
  total: number
  vouchers: IVouchers
}

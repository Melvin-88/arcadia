import { VoucherStatus } from '../types';

export const voucherStatusLabelMap: { [key in VoucherStatus]: string } = {
  [VoucherStatus.pending]: 'Pending',
  [VoucherStatus.used]: 'Used',
  [VoucherStatus.revoked]: 'Revoked',
  [VoucherStatus.expired]: 'Expired',
};

import { createAction } from '@reduxjs/toolkit';
import { IGetVouchersRequestFiltersParams, VoucherID, IVouchersNormalizedData } from 'arcadia-common-fe';
import { IVouchersRevokeDialog, IVouchersRevoke } from '../types';

export const getVouchers = createAction<IGetVouchersRequestFiltersParams>('VOUCHERS/GET_VOUCHERS');
export const getVouchersSuccess = createAction<IVouchersNormalizedData>('VOUCHERS/GET_VOUCHERS/SUCCESS');
export const getVouchersError = createAction('VOUCHERS/GET_VOUCHERS/ERROR');

export const setSelectedVouchers = createAction<VoucherID[]>('VOUCHERS/SET_SELECTED_VOUCHERS');

export const setVouchersRevokeDialog = createAction<Partial<IVouchersRevokeDialog> | undefined>(
  'VOUCHERS/SET_REVOKE_DIALOG',
);
export const mergeVouchersRevokeDialog = createAction<Partial<IVouchersRevokeDialog> | undefined>(
  'VOUCHERS/MERGE_REVOKE_DIALOG',
);
export const vouchersRevoke = createAction<IVouchersRevoke>('VOUCHERS/VOUCHERS_REVOKE');

export const exportVouchers = createAction<IGetVouchersRequestFiltersParams>('VOUCHERS/EXPORT');
export const exportVouchersSuccess = createAction('VOUCHERS/EXPORT/SUCCESS');
export const exportVouchersError = createAction('VOUCHERS/EXPORT/ERROR');

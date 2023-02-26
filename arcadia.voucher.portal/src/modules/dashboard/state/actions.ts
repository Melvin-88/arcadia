import { createAction } from '@reduxjs/toolkit';
import { IGetVouchersRequestFiltersParams, IGetVouchersResponseBody } from 'arcadia-common-fe';
import { IDashboardStatisticsResponseBody, IPostVoucherRequestBody, IVoucherDialogFormState } from '../types';

export const postVoucher = createAction<IPostVoucherRequestBody>('DASHBOARD/POST_VOUCHER');

export const getStatistics = createAction('DASHBOARD/GET_STATISTICS');
export const getStatisticsSuccess = createAction<IDashboardStatisticsResponseBody>('DASHBOARD/GET_STATISTICS/SUCCESS');
export const getStatisticsError = createAction('DASHBOARD/GET_STATISTICS/ERROR');

export const getVouchers = createAction<IGetVouchersRequestFiltersParams>('DASHBOARD/GET_VOUCHERS');
export const getVouchersSuccess = createAction<IGetVouchersResponseBody>('DASHBOARD/GET_VOUCHERS/SUCCESS');
export const getVouchersError = createAction('DASHBOARD/GET_VOUCHERS/ERROR');

export const exportVouchers = createAction<IGetVouchersRequestFiltersParams>('DASHBOARD/VOUCHERS_EXPORT');
export const exportVouchersSuccess = createAction('DASHBOARD/VOUCHERS_EXPORT/SUCCESS');
export const exportVouchersError = createAction('DASHBOARD/VOUCHERS_EXPORT/ERROR');

export const setVoucherDialogForm = createAction<Partial<IVoucherDialogFormState> | undefined>('DASHBOARD/SET_VOUCHER_DIALOG_FORM');
export const mergeVoucherDialogForm = createAction<Partial<IVoucherDialogFormState>>('DASHBOARD/MERGE_VOUCHER_DIALOG_FORM');

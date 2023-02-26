import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetVouchersReportResponseBody } from '../types';

export const clearVouchersReport = createAction('REPORT/CLEAR_VOUCHERS');

export const getVouchersReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_VOUCHERS');
export const getVouchersReportSuccess = createAction<IGetVouchersReportResponseBody>('REPORT/GET_VOUCHERS/SUCCESS');
export const getVouchersReportError = createAction('REPORT/GET_VOUCHERS/ERROR');

export const exportVouchersReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_VOUCHERS');
export const exportVouchersReportSuccess = createAction('REPORT/EXPORT_VOUCHERS/SUCCESS');
export const exportVouchersReportError = createAction('REPORT/EXPORT_VOUCHERS/ERROR');

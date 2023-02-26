import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetRevenueReportResponseBody } from '../types';

export const clearRevenueReport = createAction('REPORT/CLEAR_REVENUE');

export const getRevenueReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_REVENUE');
export const getRevenueReportSuccess = createAction<IGetRevenueReportResponseBody>('REPORT/GET_REVENUE/SUCCESS');
export const getRevenueReportError = createAction('REPORT/GET_REVENUE/ERROR');

export const exportRevenueReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_REVENUE');
export const exportRevenueReportSuccess = createAction('REPORT/EXPORT_REVENUE/SUCCESS');
export const exportRevenueReportError = createAction('REPORT/EXPORT_REVENUE/ERROR');

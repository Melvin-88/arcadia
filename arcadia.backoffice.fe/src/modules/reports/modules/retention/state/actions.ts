import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetRetentionReportResponseBody } from '../types';

export const clearRetentionReport = createAction('REPORT/CLEAR_RETENTION');

export const getRetentionReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_RETENTION');
export const getRetentionReportSuccess = createAction<IGetRetentionReportResponseBody>('REPORT/GET_RETENTION/SUCCESS');
export const getRetentionReportError = createAction('REPORT/GET_RETENTION/ERROR');

export const exportRetentionReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_RETENTION');
export const exportRetentionReportSuccess = createAction('REPORT/EXPORT_RETENTION/SUCCESS');
export const exportRetentionReportError = createAction('REPORT/EXPORT_RETENTION/ERROR');

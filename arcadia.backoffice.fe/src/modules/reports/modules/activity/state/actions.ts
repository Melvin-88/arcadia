import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetActivityReportResponseBody } from '../types';

export const clearActivityReport = createAction('REPORT/CLEAR_ACTIVITY_REPORT');

export const getActivityReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_ACTIVITY_REPORT');
export const getActivityReportSuccess = createAction<IGetActivityReportResponseBody>('REPORT/GET_ACTIVITY_REPORT/SUCCESS');
export const getActivityReportError = createAction('REPORT/GET_ACTIVITY_REPORT/ERROR');

export const exportActivityReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_ACTIVITY');
export const exportActivityReportSuccess = createAction('REPORT/EXPORT_ACTIVITY/SUCCESS');
export const exportActivityReportError = createAction('REPORT/EXPORT_ACTIVITY/ERROR');

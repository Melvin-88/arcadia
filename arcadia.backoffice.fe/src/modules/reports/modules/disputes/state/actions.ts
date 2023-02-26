import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetDisputesReportResponseBody } from '../types';

export const clearDisputesReport = createAction('REPORT/CLEAR_DISPUTES');

export const getDisputesReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_DISPUTES');
export const getDisputesReportSuccess = createAction<IGetDisputesReportResponseBody>('REPORT/GET_DISPUTES/SUCCESS');
export const getDisputesReportError = createAction('REPORT/GET_DISPUTES/ERROR');

export const exportDisputesReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_DISPUTES');
export const exportDisputesReportSuccess = createAction('REPORT/EXPORT_DISPUTES/SUCCESS');
export const exportDisputesReportError = createAction('REPORT/EXPORT_DISPUTES/ERROR');

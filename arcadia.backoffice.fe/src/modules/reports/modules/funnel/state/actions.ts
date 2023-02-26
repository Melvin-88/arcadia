import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetFunnelReportResponseBody } from '../types';

export const clearFunnelReport = createAction('REPORT/CLEAR_FUNNEL');

export const getFunnelReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_FUNNEL');
export const getFunnelReportSuccess = createAction<IGetFunnelReportResponseBody>('REPORT/GET_FUNNEL/SUCCESS');
export const getFunnelReportError = createAction('REPORT/GET_FUNNEL/ERROR');

export const exportFunnelReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_FUNNEL');
export const exportFunnelReportSuccess = createAction('REPORT/EXPORT_FUNNEL/SUCCESS');
export const exportFunnelReportError = createAction('REPORT/EXPORT_FUNNEL/ERROR');

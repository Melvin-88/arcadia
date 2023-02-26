import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportsFilterParams, IGetProcessedReportsResponseBody, IProcessedReportsState } from '../types';

export const getProcessedReports = createAction<IGetProcessedReportsFilterParams>('REPORTS/GET_PROCESSED_REPORTS');
export const getProcessedReportsSuccess = createAction<Partial<IGetProcessedReportsResponseBody>>('REPORTS/GET_PROCESSED_REPORTS/SUCCESS');
export const getProcessedReportsError = createAction('REPORTS/GET_PROCESSED_REPORTS/ERROR');

export const setProcessedReportsDialog = createAction<Partial<IProcessedReportsState> | undefined>(
  'REPORTS/SET_PROCESSED_REPORTS_DIALOG',
);

import { createReducer } from '@reduxjs/toolkit';
import {
  clearRetentionReport,
  getRetentionReport,
  getRetentionReportSuccess,
  getRetentionReportError,
  exportRetentionReportError,
  exportRetentionReportSuccess,
  exportRetentionReport,
} from './actions';
import { IRetentionReportReducer } from '../types';

export const initialState: IRetentionReportReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  data: [],
  info: {
    available: 0,
    inProgress: 0,
    toCreate: 0,
  },
};

export const retentionReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearRetentionReport, () => ({
    ...initialState,
  }));

  builder.addCase(getRetentionReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getRetentionReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getRetentionReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportRetentionReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportRetentionReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportRetentionReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

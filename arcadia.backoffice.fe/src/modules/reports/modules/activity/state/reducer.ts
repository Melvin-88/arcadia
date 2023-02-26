import { createReducer } from '@reduxjs/toolkit';
import {
  clearActivityReport,
  getActivityReport,
  getActivityReportSuccess,
  getActivityReportError,
  exportActivityReportError,
  exportActivityReportSuccess,
  exportActivityReport,
} from './actions';
import { IActivityReportReducer } from '../types';

export const initialState: IActivityReportReducer = {
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

export const activityReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearActivityReport, () => ({
    ...initialState,
  }));

  builder.addCase(getActivityReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getActivityReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getActivityReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportActivityReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportActivityReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportActivityReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

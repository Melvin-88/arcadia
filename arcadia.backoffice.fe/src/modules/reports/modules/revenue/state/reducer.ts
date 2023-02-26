import { createReducer } from '@reduxjs/toolkit';
import {
  clearRevenueReport,
  getRevenueReport,
  getRevenueReportSuccess,
  getRevenueReportError,
  exportRevenueReportError,
  exportRevenueReportSuccess,
  exportRevenueReport,
} from './actions';
import { IRevenueReportReducer } from '../types';

export const initialState: IRevenueReportReducer = {
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

export const revenueReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearRevenueReport, () => ({
    ...initialState,
  }));

  builder.addCase(getRevenueReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getRevenueReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getRevenueReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportRevenueReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportRevenueReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportRevenueReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

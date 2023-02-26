import { createReducer } from '@reduxjs/toolkit';
import {
  clearFunnelReport,
  getFunnelReport,
  getFunnelReportSuccess,
  getFunnelReportError,
  exportFunnelReportError,
  exportFunnelReportSuccess,
  exportFunnelReport,
} from './actions';
import { IFunnelReportReducer } from '../types';

export const initialState: IFunnelReportReducer = {
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

export const funnelReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearFunnelReport, () => ({
    ...initialState,
  }));

  builder.addCase(getFunnelReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getFunnelReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getFunnelReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportFunnelReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportFunnelReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportFunnelReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

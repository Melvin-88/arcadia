import { createReducer } from '@reduxjs/toolkit';
import {
  clearDisputesReport,
  getDisputesReport,
  getDisputesReportSuccess,
  getDisputesReportError,
  exportDisputesReportError,
  exportDisputesReportSuccess,
  exportDisputesReport,
} from './actions';
import { IDisputesReportReducer } from '../types';

export const initialState: IDisputesReportReducer = {
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

export const disputesReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearDisputesReport, () => ({
    ...initialState,
  }));

  builder.addCase(getDisputesReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getDisputesReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getDisputesReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportDisputesReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportDisputesReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportDisputesReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

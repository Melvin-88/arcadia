import { createReducer } from '@reduxjs/toolkit';
import {
  clearVouchersReport,
  getVouchersReport,
  getVouchersReportSuccess,
  getVouchersReportError,
  exportVouchersReportError,
  exportVouchersReportSuccess,
  exportVouchersReport,
} from './actions';
import { IVouchersReportReducer } from '../types';

export const initialState: IVouchersReportReducer = {
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

export const vouchersReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearVouchersReport, () => ({
    ...initialState,
  }));

  builder.addCase(getVouchersReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getVouchersReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getVouchersReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportVouchersReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportVouchersReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportVouchersReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

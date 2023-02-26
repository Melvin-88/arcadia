import { createReducer } from '@reduxjs/toolkit';
import {
  clearPlayerBlocksReport,
  getPlayerBlocksReport,
  getPlayerBlocksReportSuccess,
  getPlayerBlocksReportError,
  exportPlayerBlocksReportError,
  exportPlayerBlocksReportSuccess,
  exportPlayerBlocksReport,
} from './actions';
import { IPlayerBlocksReportReducer } from '../types';

export const initialState: IPlayerBlocksReportReducer = {
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

export const playerBlocksReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearPlayerBlocksReport, () => ({
    ...initialState,
  }));

  builder.addCase(getPlayerBlocksReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getPlayerBlocksReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getPlayerBlocksReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportPlayerBlocksReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportPlayerBlocksReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportPlayerBlocksReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import {
  clearPlayerStatsReport,
  getPlayerStatsReport,
  getPlayerStatsReportSuccess,
  getPlayerStatsReportError,
  exportPlayerStatsReportError,
  exportPlayerStatsReportSuccess,
  exportPlayerStatsReport,
} from './actions';
import { IPlayerStatsReportReducer } from '../types';

export const initialState: IPlayerStatsReportReducer = {
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

export const playerStatsReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearPlayerStatsReport, () => ({
    ...initialState,
  }));

  builder.addCase(getPlayerStatsReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getPlayerStatsReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getPlayerStatsReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportPlayerStatsReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportPlayerStatsReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportPlayerStatsReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

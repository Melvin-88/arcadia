import { createReducer } from '@reduxjs/toolkit';
import {
  clearMachineStatusReport,
  getMachineStatusReport,
  getMachineStatusReportSuccess,
  getMachineStatusReportError,
  exportMachineStatusReportError,
  exportMachineStatusReportSuccess,
  exportMachineStatusReport,
} from './actions';
import { IMachineStatusReportReducer } from '../types';

export const initialState: IMachineStatusReportReducer = {
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

export const machineStatusReportReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearMachineStatusReport, () => ({
    ...initialState,
  }));

  builder.addCase(getMachineStatusReport, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(getMachineStatusReportSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getMachineStatusReportError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportMachineStatusReport, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportMachineStatusReportSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportMachineStatusReportError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

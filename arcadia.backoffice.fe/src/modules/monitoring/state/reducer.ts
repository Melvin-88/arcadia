import { createReducer } from '@reduxjs/toolkit';
import {
  getMonitoring,
  getMonitoringSuccess,
  getMonitoringError,
  setMonitoringDialogAction,
  mergeMonitoringDialogAction,
  mergeMonitoringDialogForm,
  setMonitoringDialogForm,
  setSegmentSubset,
  mergeSegmentSubset,
} from './actions';
import { IMonitoringReducer, MonitoringAction } from '../types';

export const initialState: IMonitoringReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  monitoring: [],
  dialogAction: {
    id: null,
    action: MonitoringAction.remove,
    isOpen: false,
    isLoading: false,
  },
  segmentSubset: {
    isLoading: false,
    machines: [],
    groups: [],
    operators: [],
  },
  dialogForm: {
    isOpen: false,
    isLoading: false,
    initialValues: {},
  },
};

export const monitoringReducer = createReducer(initialState, (builder) => {
  builder.addCase(getMonitoring, (state) => ({
    ...state,
    total: 0,
    monitoring: [],
    isLoading: true,
  }));
  builder.addCase(getMonitoringSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getMonitoringError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setMonitoringDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeMonitoringDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setMonitoringDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeMonitoringDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(setSegmentSubset, (state, { payload }) => ({
    ...state,
    segmentSubset: {
      ...initialState.segmentSubset,
      ...payload,
    },
  }));
  builder.addCase(mergeSegmentSubset, (state, { payload }) => ({
    ...state,
    segmentSubset: {
      ...state.segmentSubset,
      ...payload,
    },
  }));
});

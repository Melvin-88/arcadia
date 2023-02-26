import { createReducer } from '@reduxjs/toolkit';
import { IAlertsReducer } from '../types';
import {
  exportAlerts,
  exportAlertsError,
  exportAlertsSuccess,
  getAlerts,
  getAlertsError,
  getAlertsSuccess,
  setDismissDialog,
  setSelectedAlerts,
  mergeDismissDialog,
} from './actions';

export const initialState: IAlertsReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  entities: {},
  ids: [],
  selectedAlerts: [],
  dismissDialog: {
    isOpen: false,
    isLoading: false,
  },
};

export const alertsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getAlerts, (state) => ({
    ...state,
    total: 0,
    alerts: [],
    selectedAlerts: [],
    isLoading: true,
  }));
  builder.addCase(getAlertsSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getAlertsError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setSelectedAlerts, (state, { payload }) => ({
    ...state,
    selectedAlerts: payload,
  }));

  builder.addCase(setDismissDialog, (state, { payload }) => ({
    ...state,
    dismissDialog: {
      ...initialState.dismissDialog,
      ...payload,
    },
  }));
  builder.addCase(mergeDismissDialog, (state, { payload }) => ({
    ...state,
    dismissDialog: {
      ...state.dismissDialog,
      ...payload,
    },
  }));

  builder.addCase(exportAlerts, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportAlertsSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportAlertsError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

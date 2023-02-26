import { createReducer } from '@reduxjs/toolkit';
import { IMaintenanceReducer, MaintenanceAction } from '../types';
import {
  getMaintenance,
  getMaintenanceSuccess,
  getMaintenanceError,
  exportMaintenance,
  exportMaintenanceSuccess,
  exportMaintenanceError,
  setMaintenanceDialogAction,
  mergeMaintenanceDialogAction,
  setMaintenanceDialogMachineIdentification,
  machineIdentificationSuccess,
  setMaintenanceDialogQRScan,
  scanQRCodeSuccess,
} from './actions';

export const initialState: IMaintenanceReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  alerts: [],
  dialogAction: {
    action: MaintenanceAction.dismiss,
    isOpen: false,
    isLoading: false,
  },
  dialogMachineIdentification: {
    action: MaintenanceAction.dismiss,
    isOpen: false,
  },
  dialogScanQRCode: {
    isOpen: false,
  },
};

export const maintenanceReducer = createReducer(initialState, (builder) => {
  builder.addCase(getMaintenance, (state) => ({
    ...state,
    total: 0,
    alerts: [],
    isLoading: true,
  }));
  builder.addCase(getMaintenanceSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getMaintenanceError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportMaintenance, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportMaintenanceSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportMaintenanceError, (state) => ({
    ...state,
    isExporting: false,
  }));

  builder.addCase(setMaintenanceDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeMaintenanceDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(setMaintenanceDialogMachineIdentification, (state, { payload }) => ({
    ...state,
    dialogMachineIdentification: {
      ...initialState.dialogMachineIdentification,
      ...payload,
    },
  }));
  builder.addCase(machineIdentificationSuccess, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
    dialogMachineIdentification: {
      ...initialState.dialogMachineIdentification,
    },
  }));

  builder.addCase(setMaintenanceDialogQRScan, (state, { payload }) => ({
    ...state,
    dialogScanQRCode: {
      ...initialState.dialogScanQRCode,
      ...payload,
    },
  }));
  builder.addCase(scanQRCodeSuccess, (state, { payload: { machineId } }) => ({
    ...state,
    machineId,
    dialogScanQRCode: {
      ...initialState.dialogScanQRCode,
    },
  }));
});

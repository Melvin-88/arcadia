import { createReducer } from '@reduxjs/toolkit';
import { IMachinesReducer, MachineAction } from '../types';
import {
  exportMachines,
  exportMachinesError,
  exportMachinesSuccess,
  getMachines,
  getMachinesError,
  getMachinesSuccess,
  setMachinesDialogAction,
  mergeMachinesDialogAction,
  setMachinesDialogForm,
  mergeMachinesDialogForm,
  mergeDialogActivateMachine,
  setDialogActivateMachine,
  setDialogReassignMachine,
  mergeDialogReassignMachine,
} from './actions';

export const initialState: IMachinesReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  machines: [],
  dialogAction: {
    id: null,
    action: MachineAction.dry,
    isOpen: false,
    isLoading: false,
  },
  dialogForm: {
    isOpen: false,
    isLoading: false,
  },
  dialogActivate: {
    id: null,
    isOpen: false,
    isLoading: false,
  },
  dialogReassign: {
    id: null,
    isOpen: false,
    isLoading: false,
  },
};

export const machinesReducer = createReducer(initialState, (builder) => {
  builder.addCase(getMachines, (state) => ({
    ...state,
    total: 0,
    machines: [],
    isLoading: true,
  }));
  builder.addCase(getMachinesSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getMachinesError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setMachinesDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeMachinesDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setMachinesDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeMachinesDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(setDialogActivateMachine, (state, { payload }) => ({
    ...state,
    dialogActivate: {
      ...initialState.dialogActivate,
      ...payload,
    },
  }));
  builder.addCase(mergeDialogActivateMachine, (state, { payload }) => ({
    ...state,
    dialogActivate: {
      ...state.dialogActivate,
      ...payload,
    },
  }));

  builder.addCase(setDialogReassignMachine, (state, { payload }) => ({
    ...state,
    dialogReassign: {
      ...initialState.dialogReassign,
      ...payload,
    },
  }));
  builder.addCase(mergeDialogReassignMachine, (state, { payload }) => ({
    ...state,
    dialogReassign: {
      ...state.dialogReassign,
      ...payload,
    },
  }));

  builder.addCase(exportMachines, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportMachinesSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportMachinesError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { AdministrationAction, IAdministrationReducer } from '../types';
import {
  getAdministration,
  getAdministrationError,
  getAdministrationSuccess,
  exportAdministrationSuccess,
  exportAdministration,
  exportAdministrationError,
  mergeAdministrationDialogForm,
  setAdministrationDialogForm,
  mergeAdministrationDialogAction,
  setAdministrationDialogAction,
  mergeAdministrationDialogEditPassword,
  setAdministrationDialogEditPassword,
  setAdministrationDialogRegisterChips,
  mergeAdministrationDialogRegisterChips,
  mergeAdministrationDialogDisqualifyChips,
  setAdministrationDialogDisqualifyChips,
  setAdministrationDialogFindChip,
  mergeAdministrationDialogFindChip,
  mergeAdministrationDialogUserActions,
  setAdministrationDialogUserActions,
  exportAdministrationUserActions,
  exportAdministrationUserActionsSuccess,
  exportAdministrationUserActionsError,
} from './actions';

export const initialState: IAdministrationReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  users: [],
  dialogForm: {
    isOpen: false,
    isLoading: false,
  },
  dialogAction: {
    id: null,
    action: AdministrationAction.enable,
    isOpen: false,
    isLoading: false,
  },
  dialogEditPassword: {
    id: null,
    isOpen: false,
    isLoading: false,
  },
  dialogRegisterChips: {
    isOpen: false,
    isLoading: false,
  },
  dialogDisqualifyChips: {
    isOpen: false,
    isLoading: false,
  },
  dialogFindChip: {
    isOpen: false,
    isLoading: false,
    total: 0,
    chips: [],
  },
  dialogUserActions: {
    isOpen: false,
    isExporting: false,
    isLoading: false,
    id: 0,
    filterParams: {
      offset: 0,
    },
    total: 0,
    actions: [],
  },
};

export const administrationReducer = createReducer(initialState, (builder) => {
  builder.addCase(getAdministration, (state) => ({
    ...state,
    total: 0,
    users: [],
    isLoading: true,
  }));
  builder.addCase(getAdministrationSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getAdministrationError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setAdministrationDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogEditPassword, (state, { payload }) => ({
    ...state,
    dialogEditPassword: {
      ...initialState.dialogEditPassword,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogEditPassword, (state, { payload }) => ({
    ...state,
    dialogEditPassword: {
      ...state.dialogEditPassword,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogRegisterChips, (state, { payload }) => ({
    ...state,
    dialogRegisterChips: {
      ...initialState.dialogRegisterChips,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogRegisterChips, (state, { payload }) => ({
    ...state,
    dialogRegisterChips: {
      ...state.dialogRegisterChips,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogDisqualifyChips, (state, { payload }) => ({
    ...state,
    dialogDisqualifyChips: {
      ...initialState.dialogDisqualifyChips,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogDisqualifyChips, (state, { payload }) => ({
    ...state,
    dialogDisqualifyChips: {
      ...state.dialogDisqualifyChips,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogFindChip, (state, { payload }) => ({
    ...state,
    dialogFindChip: {
      ...initialState.dialogFindChip,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogFindChip, (state, { payload }) => ({
    ...state,
    dialogFindChip: {
      ...state.dialogFindChip,
      ...payload,
    },
  }));

  builder.addCase(setAdministrationDialogUserActions, (state, { payload }) => ({
    ...state,
    dialogUserActions: {
      ...initialState.dialogUserActions,
      ...payload,
    },
  }));
  builder.addCase(mergeAdministrationDialogUserActions, (state, { payload }) => ({
    ...state,
    dialogUserActions: {
      ...state.dialogUserActions,
      ...payload,
    },
  }));

  builder.addCase(exportAdministrationUserActions, (state) => ({
    ...state,
    dialogUserActions: {
      ...state.dialogUserActions,
      isExporting: true,
    },
  }));
  builder.addCase(exportAdministrationUserActionsSuccess, (state) => ({
    ...state,
    dialogUserActions: {
      ...state.dialogUserActions,
      isExporting: false,
    },
  }));
  builder.addCase(exportAdministrationUserActionsError, (state) => ({
    ...state,
    dialogUserActions: {
      ...state.dialogUserActions,
      isExporting: false,
    },
  }));

  builder.addCase(exportAdministration, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportAdministrationSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportAdministrationError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

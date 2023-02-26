import { createReducer } from '@reduxjs/toolkit';
import { DisputeStatus, IDisputesReducer } from '../types';
import {
  exportDisputes,
  exportDisputesError,
  exportDisputesSuccess,
  getDisputes,
  getDisputesError,
  getDisputesSuccess,
  setDisputeDialogForm,
  mergeDisputeDialogForm,
} from './actions';

export const initialState: IDisputesReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  disputes: [],
  dialogForm: {
    isOpen: false,
    isLoading: false,
    initialValues: { status: DisputeStatus.open },
  },
};

export const disputesReducer = createReducer(initialState, (builder) => {
  builder.addCase(getDisputes, (state) => ({
    ...state,
    total: 0,
    disputes: [],
    isLoading: true,
  }));
  builder.addCase(getDisputesSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getDisputesError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setDisputeDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeDisputeDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(exportDisputes, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportDisputesSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportDisputesError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { IVouchersReducer } from '../types';
import {
  getVouchers,
  getVouchersSuccess,
  getVouchersError,
  setSelectedVouchers,
  setVouchersRevokeDialog,
  mergeVouchersRevokeDialog,
} from './actions';

export const initialState: IVouchersReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  entities: {},
  ids: [],
  selectedVouchers: [],
  dialogRevoke: {
    isOpen: false,
    isLoading: false,
  },
};

export const vouchersReducer = createReducer(initialState, (builder) => {
  builder.addCase(getVouchers, (state) => ({
    ...state,
    total: 0,
    entities: {},
    ids: [],
    selectedVouchers: [],
    isLoading: true,
  }));
  builder.addCase(getVouchersSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getVouchersError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setVouchersRevokeDialog, (state, { payload }) => ({
    ...state,
    dialogRevoke: {
      ...initialState.dialogRevoke,
      ...payload,
    },
  }));
  builder.addCase(mergeVouchersRevokeDialog, (state, { payload }) => ({
    ...state,
    dialogRevoke: {
      ...state.dialogRevoke,
      ...payload,
    },
  }));

  builder.addCase(setSelectedVouchers, (state, { payload }) => ({
    ...state,
    selectedVouchers: payload,
  }));
});

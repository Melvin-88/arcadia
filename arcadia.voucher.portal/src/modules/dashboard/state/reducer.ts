import { createReducer } from '@reduxjs/toolkit';
import { IDashboardReducer } from '../types';
import {
  getStatistics,
  getStatisticsSuccess,
  getStatisticsError,
  getVouchers,
  getVouchersSuccess,
  getVouchersError,
  exportVouchersSuccess,
  exportVouchers,
  exportVouchersError,
  setVoucherDialogForm,
  mergeVoucherDialogForm,
} from './actions';

export const initialState: IDashboardReducer = {
  isVouchersLoading: false,
  isVouchersExporting: false,
  total: 0,
  vouchers: [],
  statistics: {
    isLoading: false,
  },
  voucherDialogForm: {
    isOpen: false,
    isLoading: false,
  },
};

export const dashboardReducer = createReducer(initialState, (builder) => {
  builder.addCase(getStatistics, (state) => ({
    ...state,
    statistics: {
      ...state.statistics,
      isLoading: true,
    },
  }));
  builder.addCase(getStatisticsSuccess, (state, { payload }) => ({
    ...state,
    statistics: {
      ...state.statistics,
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getStatisticsError, (state) => ({
    ...state,
    statistics: {
      ...state.statistics,
      isLoading: false,
    },
  }));

  builder.addCase(getVouchers, (state) => ({
    ...state,
    isVouchersLoading: true,
  }));
  builder.addCase(getVouchersSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isVouchersLoading: false,
  }));
  builder.addCase(getVouchersError, (state) => ({
    ...state,
    isVouchersLoading: false,
  }));

  builder.addCase(exportVouchers, (state) => ({
    ...state,
    isVouchersExporting: true,
  }));
  builder.addCase(exportVouchersSuccess, (state) => ({
    ...state,
    isVouchersExporting: false,
  }));
  builder.addCase(exportVouchersError, (state) => ({
    ...state,
    isVouchersExporting: false,
  }));

  builder.addCase(setVoucherDialogForm, (state, { payload }) => ({
    ...state,
    voucherDialogForm: {
      ...initialState.voucherDialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeVoucherDialogForm, (state, { payload }) => ({
    ...state,
    voucherDialogForm: {
      ...state.voucherDialogForm,
      ...payload,
    },
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { ITEMS_PER_PAGE } from 'arcadia-common-fe';
import { IProcessedReportsReducer } from '../types';
import {
  getProcessedReports,
  getProcessedReportsSuccess,
  getProcessedReportsError,
  setProcessedReportsDialog,
} from './actions';

export const initialState: IProcessedReportsReducer = {
  isOpen: false,
  isLoading: false,
  data: [],
  total: 0,
  filterParams: {
    take: ITEMS_PER_PAGE,
    offset: 0,
  },
};

export const processedReportsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getProcessedReports, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: true,
  }));
  builder.addCase(getProcessedReportsSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getProcessedReportsError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setProcessedReportsDialog, (state, { payload }) => ({
    ...initialState,
    ...payload,
  }));
});

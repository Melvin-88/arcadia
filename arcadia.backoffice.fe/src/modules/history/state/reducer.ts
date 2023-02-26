import { createReducer } from '@reduxjs/toolkit';
import { ITEMS_PER_PAGE } from 'arcadia-common-fe';
import {
  getHistoryData,
  getHistoryDataSuccess,
  getHistoryDataError,
  resetHistory,
} from './actions';
import { IHistoryReducer } from '../types';

export const initialState: IHistoryReducer = {
  id: 0,
  isOpen: false,
  isLoading: false,
  total: 0,
  history: [],
  filterParams: {
    take: ITEMS_PER_PAGE,
  },
};

export const historyReducer = createReducer(initialState, (builder) => {
  builder.addCase(getHistoryData, (state, { payload }) => ({
    ...state,
    ...payload,
    total: 0,
    history: [],
    isOpen: true,
    isLoading: true,
  }));
  builder.addCase(getHistoryDataSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getHistoryDataError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(resetHistory, () => ({
    ...initialState,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { IReportsReducer } from '../types';
import { setReportType } from './actions';

export const initialState: IReportsReducer = {
  reportType: null,
};

export const reportsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setReportType, (state, { payload }) => ({
    ...state,
    reportType: payload,
  }));
});

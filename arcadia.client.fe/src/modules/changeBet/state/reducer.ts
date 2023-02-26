import { createReducer } from '@reduxjs/toolkit';
import { IChangeBetReducer } from '../types';
import { mergeChangeBet, setGroups } from './actions';

const initialState: IChangeBetReducer = {
  isSnackbarOpen: false,
  groups: [],
};

export const changeBetReducer = createReducer(initialState, (builder) => {
  builder.addCase(mergeChangeBet, (state, { payload }) => ({
    ...state,
    ...payload,
  }));

  builder.addCase(setGroups, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { IGameRulesReducer } from '../types';
import { setGameRules } from './actions';

const initialState: IGameRulesReducer = {
  isOpened: false,
};

export const gameRulesReducer = createReducer(initialState, (builder) => {
  builder.addCase(setGameRules, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});

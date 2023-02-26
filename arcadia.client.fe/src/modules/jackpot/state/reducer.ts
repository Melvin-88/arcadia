import { createReducer } from '@reduxjs/toolkit';
import { IJackpotReducer } from '../types';
import {
  setJackpotIsActive,
  setJackpotPotState,
  setJackpotActiveGameId,
  setJackpotIsOptInEnabled,
  setJackpotWinData,
} from './actions';

const initialState: IJackpotReducer = {
  activeGameId: '',
  isActive: false,
  isOptInEnabled: false,
  potStatesMap: {},
  winData: null,
};

export const jackpotReducer = createReducer(initialState, (builder) => {
  builder.addCase(setJackpotActiveGameId, (state, { payload }) => ({
    ...state,
    activeGameId: payload.gameId,
  }));

  builder.addCase(setJackpotIsActive, (state, { payload }) => ({
    ...state,
    ...payload,
  }));

  builder.addCase(setJackpotIsOptInEnabled, (state, { payload }) => ({
    ...state,
    isOptInEnabled: payload.isOptInEnabled,
  }));

  builder.addCase(setJackpotPotState, (state, { payload }) => ({
    ...state,
    potStatesMap: {
      ...state.potStatesMap,
      [payload.gameId]: payload.potState,
    },
  }));

  builder.addCase(setJackpotWinData, (state, { payload }) => ({
    ...state,
    winData: payload,
  }));
});

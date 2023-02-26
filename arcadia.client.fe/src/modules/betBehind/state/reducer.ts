import { createReducer } from '@reduxjs/toolkit';
import { IBetBehindReducer } from '../types';
import {
  disableBetBehind,
  enableBetBehind,
  mergeBetBehind,
  mergeBetBehindConfig,
  setBetBehindConfig,
} from './actions';
import { BetBehindStatus } from '../../../types/betBehind';

const initialState: IBetBehindReducer = {
  isSnackbarOpen: false,
  betBehindStatus: BetBehindStatus.pendingStart,
  config: {
    stopAfterRounds: 1,
    singleWinThreshold: 0,
    stopIfJackpot: false,
    lowLimitMultiplier: 1,
    hiLimitMultiplier: 1,
  },
};

export const betBehindReducer = createReducer(initialState, (builder) => {
  builder.addCase(enableBetBehind, (state) => ({
    ...state,
    betBehindStatus: BetBehindStatus.pendingStart,
  }));
  builder.addCase(disableBetBehind, (state) => ({
    ...state,
    betBehindStatus: BetBehindStatus.pendingEnd,
  }));

  builder.addCase(mergeBetBehind, (state, { payload }) => {
    const { config } = payload;

    return {
      ...state,
      ...payload,
      config: {
        ...state.config,
        ...config,
      },
    };
  });

  builder.addCase(setBetBehindConfig, (state, { payload }) => ({
    ...state,
    config: payload,
  }));
  builder.addCase(mergeBetBehindConfig, (state, { payload }) => ({
    ...state,
    config: {
      ...state.config,
      ...payload,
    },
  }));
});

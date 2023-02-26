import { createReducer } from '@reduxjs/toolkit';
import { IAutoplayReducer } from '../types';
import {
  mergeAutoplayConfig,
  mergeAutoplay,
  setAutoplayConfig,
  setAutoplay,
  setAutoSwingMode,
} from './actions';
import { TiltMode } from '../../../types/autoplay';

const initialState: IAutoplayReducer = {
  isSnackbarOpen: false,
  isEnabled: false,
  config: {
    stopAfterRounds: 1,
    singleWinThreshold: 1, // TODO: Should be reviewed after backend connection
    stopIfJackpot: false,
    tiltMode: TiltMode.auto,
    lowLimitMultiplier: 1,
    hiLimitMultiplier: 100,
  },
};

export const autoplayReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAutoplay, (state, { payload }) => ({
    ...initialState,
    ...payload,
  }));
  builder.addCase(mergeAutoplay, (state, { payload }) => {
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

  builder.addCase(setAutoplayConfig, (state, { payload }) => ({
    ...state,
    config: {
      ...initialState.config,
      ...payload,
    },
  }));
  builder.addCase(mergeAutoplayConfig, (state, { payload }) => ({
    ...state,
    config: {
      ...state.config,
      ...payload,
    },
  }));
  builder.addCase(setAutoSwingMode, (state, { payload }) => ({
    ...state,
    config: {
      ...state.config,
      tiltMode: payload.mode,
    },
  }));
});

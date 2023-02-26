import { createReducer } from '@reduxjs/toolkit';
import { mergeOverlay } from './actions';
import { IOverlayReducer } from '../types';

const initialState: IOverlayReducer = {
  isMachineSeedingVisible: false,
  isRegularRoundStartVisible: false,
  isScatterRoundStartVisible: false,
  isScatterRoundWonVisible: false,
};

export const overlayReducer = createReducer(initialState, (builder) => {
  builder.addCase(mergeOverlay, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});

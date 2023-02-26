import { createReducer } from '@reduxjs/toolkit';
import {
  addChipToChipWinQueue,
  addPhantomChipWinQueueItem,
  mergePhantomChipWinQueueItem,
  removeChipFromChipWinQueue,
  removePhantomChipWinQueueItem,
  setActiveRound,
  setBalance,
  setCoins,
  setIdleTimeoutStartTimestamp,
  setIsDetectingDroppedChips,
  setTotalWin,
  setCancelStacksDialog,
} from './actions';
import { IGameReducer } from '../types';

export const initialState: IGameReducer = {
  activeRound: null,
  idleTimeoutStartTimestamp: null,
  coins: 0,
  balance: 0,
  totalWin: 0,
  isDetectingDroppedChips: false,
  chipWinQueue: [],
  phantomChipWinQueue: [],
  cancelStacksDialog: {
    isOpen: false,
  },
};

export const gameReducer = createReducer(initialState, (builder) => {
  builder.addCase(setActiveRound, (state, { payload }) => ({
    ...state,
    activeRound: payload.activeRound,
  }));

  builder.addCase(setIdleTimeoutStartTimestamp, (state, { payload }) => ({
    ...state,
    idleTimeoutStartTimestamp: payload.timestamp,
  }));

  builder.addCase(setCoins, (state, { payload }) => ({
    ...state,
    coins: payload.coins,
  }));

  builder.addCase(setBalance, (state, { payload }) => ({
    ...state,
    balance: payload.valueInCash,
  }));

  builder.addCase(setTotalWin, (state, { payload }) => ({
    ...state,
    totalWin: payload.totalWin,
  }));

  builder.addCase(setIsDetectingDroppedChips, (state, { payload }) => ({
    ...state,
    isDetectingDroppedChips: payload.value,
  }));
  builder.addCase(addChipToChipWinQueue, (state, { payload }) => ({
    ...state,
    chipWinQueue: [
      payload,
      ...state.chipWinQueue,
    ],
  }));
  builder.addCase(removeChipFromChipWinQueue, (state, { payload }) => ({
    ...state,
    chipWinQueue: state.chipWinQueue.filter((item) => item.id !== payload.id),
  }));

  builder.addCase(addPhantomChipWinQueueItem, (state, { payload }) => ({
    ...state,
    phantomChipWinQueue: [
      ...state.phantomChipWinQueue,
      payload,
    ],
  }));
  builder.addCase(mergePhantomChipWinQueueItem, (state, { payload }) => ({
    ...state,
    phantomChipWinQueue: state.phantomChipWinQueue.map((item) => {
      if (item.id !== payload.id) {
        return item;
      }

      return {
        ...item,
        ...payload.data,
      };
    }),
  }));
  builder.addCase(removePhantomChipWinQueueItem, (state, { payload }) => ({
    ...state,
    phantomChipWinQueue: state.phantomChipWinQueue.filter((item) => item.id !== payload.id),
  }));

  builder.addCase(setCancelStacksDialog, (state, { payload }) => ({
    ...state,
    cancelStacksDialog: payload,
  }));
});

import { createReducer } from '@reduxjs/toolkit';
import { IPlayersReducer, PlayerAction } from '../types';
import {
  exportPlayers,
  exportPlayersError,
  exportPlayersSuccess,
  getPlayers,
  getPlayersError,
  getPlayersSuccess,
  setPlayersDialogAction,
  mergePlayersDialogAction,
} from './actions';

export const initialState: IPlayersReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  players: [],
  dialogAction: {
    id: '',
    action: PlayerAction.block,
    isOpen: false,
    isLoading: false,
  },
};

export const playersReducer = createReducer(initialState, (builder) => {
  builder.addCase(getPlayers, (state) => ({
    ...state,
    total: 0,
    players: [],
    isLoading: true,
  }));
  builder.addCase(getPlayersSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getPlayersError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setPlayersDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergePlayersDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(exportPlayers, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportPlayersSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportPlayersError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

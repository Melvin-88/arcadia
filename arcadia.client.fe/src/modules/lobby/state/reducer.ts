import { createReducer } from '@reduxjs/toolkit';
import { ILobbyReducer } from '../types';
import {
  getLobbyData,
  getLobbyDataError,
  getLobbyDataSuccess,
} from './actions';

export const initialState: ILobbyReducer = {
  groups: [],
};

export const lobbyReducer = createReducer(initialState, (builder) => {
  builder.addCase(getLobbyData, (state) => ({
    ...state,
  }));
  builder.addCase(getLobbyDataSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
  builder.addCase(getLobbyDataError, (state) => ({
    ...state,
  }));
});

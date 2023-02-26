import { createReducer } from '@reduxjs/toolkit';
import { IMenuReducer } from '../types';
import { setMenu } from './actions';

const initialState: IMenuReducer = {
  openedMenu: null,
};

export const menuReducer = createReducer(initialState, (builder) => {
  builder.addCase(setMenu, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});

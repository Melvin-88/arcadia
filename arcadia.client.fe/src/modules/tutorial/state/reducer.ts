import { createReducer } from '@reduxjs/toolkit';
import { ITutorialReducer } from '../types';
import { setTutorial } from './actions';

const initialState: ITutorialReducer = {
  isOpened: false,
};

export const tutorialReducer = createReducer(initialState, (builder) => {
  builder.addCase(setTutorial, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});

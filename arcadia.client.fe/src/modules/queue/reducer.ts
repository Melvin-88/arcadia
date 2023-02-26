import { createReducer } from '@reduxjs/toolkit';
import { setQueue, setQueueLeaveDialog } from './actions';
import { IQueueReducer } from './types';

export const initialState: IQueueReducer = {
  viewers: 0,
  queue: [],
  queueLeaveDialog: {
    isOpen: false,
  },
};

export const queueReducer = createReducer(initialState, (builder) => {
  builder.addCase(setQueue, (state, { payload }) => ({
    ...state,
    ...payload,
  }));

  builder.addCase(setQueueLeaveDialog, (state, { payload }) => ({
    ...state,
    queueLeaveDialog: {
      ...payload,
    },
  }));
});

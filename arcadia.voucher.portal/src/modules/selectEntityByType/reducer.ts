import { createReducer } from '@reduxjs/toolkit';
import {
  getEntityData, getEntityDataSuccess, getEntityDataError,
} from './actions';

export const initialState = {
};

export const selectEntityByTypeReducer = createReducer(initialState, (builder) => {
  builder.addCase(getEntityData, (state, { payload: { entityType } }) => ({
    ...state,
    [entityType]: { isLoading: true },
  }));
  builder.addCase(getEntityDataSuccess, (state, { payload: { options, entityType } }) => ({
    ...state,
    [entityType]: {
      options,
      isLoading: false,
    },
  }));
  builder.addCase(getEntityDataError, (state, { payload: { entityType } }) => ({
    ...state,
    [entityType]: { isLoading: false },
  }));
});

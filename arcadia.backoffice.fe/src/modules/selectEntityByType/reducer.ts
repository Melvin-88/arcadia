import { createReducer } from '@reduxjs/toolkit';
import {
  getEntityData, getEntityDataSuccess, getEntityDataError,
} from './actions';
import { ISelectEntityByTypeReducer } from './types';

export const initialState: ISelectEntityByTypeReducer = {
};

export const selectEntityByTypeReducer = createReducer(initialState, (builder) => {
  builder.addCase(getEntityData, (state, { payload: { entityType } }) => ({
    ...state,
    [entityType]: {
      ...state[entityType],
      isLoading: true,
    },
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

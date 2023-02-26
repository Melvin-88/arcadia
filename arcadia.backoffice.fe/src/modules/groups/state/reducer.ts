import { createReducer } from '@reduxjs/toolkit';
import { GroupAction, IGroupsReducer } from '../types';
import {
  exportGroups,
  exportGroupsError,
  exportGroupsSuccess,
  getGroups,
  getGroupsError,
  getGroupsSuccess,
  mergeGroupsDialogAction,
  mergeGroupsDialogForm,
  setGroupsDialogAction,
  setGroupsDialogForm,
} from './actions';

export const initialState: IGroupsReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  entities: {},
  ids: [],
  dialogAction: {
    id: null,
    action: GroupAction.activate,
    isOpen: false,
    isLoading: false,
  },
  dialogForm: {
    isOpen: false,
    isLoading: false,
  },
};

export const groupsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getGroups, (state) => ({
    ...state,
    total: 0,
    entities: {},
    ids: [],
    isLoading: true,
  }));
  builder.addCase(getGroupsSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getGroupsError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setGroupsDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeGroupsDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setGroupsDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeGroupsDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(exportGroups, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportGroupsSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportGroupsError, (state) => ({
    ...state,
    isExporting: false,
  }));
});

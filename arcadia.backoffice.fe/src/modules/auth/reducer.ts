import { createReducer } from '@reduxjs/toolkit';
import {
  signIn,
  signInSuccess,
  signInError,
  getPermissions,
  getPermissionsSuccess,
  getPermissionsError,
  logOut,
} from './actions';
import { IAuthReducer } from './types';
import { LocalStorageKeys } from '../../constants';

const getUserFromLocalStorage = () => {
  const userString = localStorage.getItem(LocalStorageKeys.user);

  if (userString) {
    return JSON.parse(userString);
  }

  return null;
};

export const initialState: IAuthReducer = {
  token: localStorage.getItem(LocalStorageKeys.accessToken),
  user: getUserFromLocalStorage(),
  isLoading: false,
  isPermissionsLoading: false,
  permissionsIds: [],
  permissionsEntities: {},
  userPermissions: [],
};

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(signIn, (state) => ({
    ...state,
    isLoading: true,
  }));
  builder.addCase(signInSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(signInError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(getPermissions, (state) => ({
    ...state,
    isPermissionsLoading: true,
  }));
  builder.addCase(getPermissionsSuccess, (state, { payload }) => ({
    ...state,
    isPermissionsLoading: false,
    ...payload,
  }));
  builder.addCase(getPermissionsError, (state) => ({
    ...state,
    isPermissionsLoading: false,
  }));

  builder.addCase(logOut, () => initialState);
});

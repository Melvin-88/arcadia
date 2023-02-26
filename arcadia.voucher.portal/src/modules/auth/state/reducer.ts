import { createReducer } from '@reduxjs/toolkit';
import {
  signIn,
  signInSuccess,
  signInError,
  logOut,
} from './actions';
import { IAuthReducer } from '../types';
import { LocalStorageKeys } from '../../../constants';

const getOperatorFromLocalStorage = () => {
  const operatorString = localStorage.getItem(LocalStorageKeys.operator);

  if (operatorString) {
    return JSON.parse(operatorString);
  }

  return null;
};

export const initialState: IAuthReducer = {
  isLoading: false,
  token: localStorage.getItem(LocalStorageKeys.accessToken),
  operator: getOperatorFromLocalStorage(),
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

  builder.addCase(logOut, () => initialState);
});

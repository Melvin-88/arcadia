import { createAction } from '@reduxjs/toolkit';
import {
  ISignInRequestBody,
  ISignInResponseBody,
  IPermissionsData,
} from './types';

export const signIn = createAction<ISignInRequestBody>('AUTH/SIGN_IN');
export const signInSuccess = createAction<ISignInResponseBody>('AUTH/SIGN_IN/SUCCESS');
export const signInError = createAction('AUTH/SIGN_IN/ERROR');

export const getPermissions = createAction('AUTH/GET_PERMISSIONS');
export const getPermissionsSuccess = createAction<Partial<IPermissionsData>>('AUTH/GET_PERMISSIONS/SUCCESS');
export const getPermissionsError = createAction('AUTH/GET_PERMISSIONS/ERROR');

export const logOut = createAction('AUTH/LOG_OUT');

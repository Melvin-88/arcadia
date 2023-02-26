import { createAction } from '@reduxjs/toolkit';
import { ISignInRequestBody, ISignInResponseBody } from '../types';

export const signIn = createAction<ISignInRequestBody>('AUTH/SIGN_IN');
export const signInSuccess = createAction<ISignInResponseBody>('AUTH/SIGN_IN/SUCCESS');
export const signInError = createAction('AUTH/SIGN_IN/ERROR');

export const logOut = createAction('AUTH/LOG_OUT');

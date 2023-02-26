import { createAction } from '@reduxjs/toolkit';
import { ISignInRequestBody } from '../types';

export const signIn = createAction<ISignInRequestBody>('AUTH/SIGN_IN');

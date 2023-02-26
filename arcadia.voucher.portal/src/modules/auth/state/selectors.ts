import { IAuthStoreSlice } from '../types';

export const authReducerSelector = ({ authReducer }: IAuthStoreSlice) => authReducer;

export const isAuthenticatedSelector = ({ authReducer }: IAuthStoreSlice) => !!authReducer.token;

export const operatorSelector = ({ authReducer }: IAuthStoreSlice) => authReducer.operator;

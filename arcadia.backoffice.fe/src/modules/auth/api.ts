import {
  ISignInRequestBody,
  ISignInResponseBody,
  IGetPermissionsResponseBody,
  IGetUserPermissionsResponseBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const signInRequest = (data: ISignInRequestBody) => {
  const url = getUrl('/auth/login');

  return makeRequest<ISignInResponseBody>(url, data, 'POST');
};

export const getPermissionsRequest = () => {
  const url = getUrl('/auth/bo-modules');

  return makeRequest<IGetPermissionsResponseBody>(url);
};

export const getUserPermissionsRequest = () => {
  const url = getUrl('/auth/permitted-modules');

  return makeRequest<IGetUserPermissionsResponseBody>(url);
};

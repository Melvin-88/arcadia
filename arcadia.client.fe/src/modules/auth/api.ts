import { ISignInRequestBody, ISignInResponseBody } from './types';
import { getUrl, makeRequest } from '../../services/api';

export const signInRequest = (data: ISignInRequestBody) => {
  const url = getUrl('/v1/auth');

  return makeRequest<ISignInResponseBody>(url, data, 'POST');
};

import { getUrl, makeRequest } from '../../services/api';
import { IPostLoginAnonymousRequestBody, IPostLoginPlayerRequestBody } from './services/types';

export const loginAnonymousRequest = (data: IPostLoginAnonymousRequestBody) => {
  const url = getUrl('/v1/auth/loginAnonymous');

  return makeRequest(url, data, 'POST');
};

export const loginPlayerRequest = (data: IPostLoginPlayerRequestBody) => {
  const url = getUrl('/v1/auth/loginPlayer');

  return makeRequest(url, data, 'POST');
};

import { IGetLobbyDataRequestQueryParams, IGetLobbyDataResponseBody } from './types';
import { getUrl, makeRequest } from '../../services/api';

export const getLobbyDataRequest = (queryParams: IGetLobbyDataRequestQueryParams) => {
  const url = getUrl('/v1/auth/lobby', queryParams);

  return makeRequest<IGetLobbyDataResponseBody>(url);
};

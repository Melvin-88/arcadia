import { getUrl, makeRequest } from '../../services/api';
import { IGetPlayersRequestFilterParams, IGetPlayersResponseBody, IPlayerActionRequestBody } from './types';

export const getPlayersRequest = (filterParams: IGetPlayersRequestFilterParams) => {
  const url = getUrl('/players', filterParams);

  return makeRequest<IGetPlayersResponseBody>(url);
};

export const blockPlayersRequest = ({ id, reason }: IPlayerActionRequestBody) => {
  const url = getUrl(`/players/${id}/block`);

  return makeRequest(url, { reason }, 'POST');
};

export const unblockPlayersRequest = (requestBody: IPlayerActionRequestBody) => {
  const url = getUrl(`/players/${requestBody.id}/unblock`);

  return makeRequest(url, undefined, 'POST');
};

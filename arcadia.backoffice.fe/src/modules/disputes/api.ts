import {
  IGetDisputesRequestFiltersParams,
  IGetDisputesResponseBody,
  IPostDisputeRequestBody,
  IPutDisputeRequestBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const postDisputeRequest = (data: IPostDisputeRequestBody) => {
  const url = getUrl('/disputes');

  return makeRequest(url, data, 'POST');
};

export const getDisputesRequest = (filterParams: IGetDisputesRequestFiltersParams) => {
  const url = getUrl('/disputes', filterParams);

  return makeRequest<IGetDisputesResponseBody>(url);
};

export const putDisputeRequest = (data: IPutDisputeRequestBody) => {
  const url = getUrl(`/disputes/${data.id}`);

  return makeRequest(url, data, 'PUT');
};

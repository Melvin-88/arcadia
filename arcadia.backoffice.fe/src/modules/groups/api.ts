import {
  IGroupActionRequestBody,
  IGetGroupsRequestFiltersParams,
  IGetGroupsResponseBody,
  IPutGroupRequestBody,
  IPostGroupRequestBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const postGroupRequest = (group: IPostGroupRequestBody) => {
  const url = getUrl('/groups');

  return makeRequest(url, group, 'POST');
};

export const getGroupsRequest = (filterParams: IGetGroupsRequestFiltersParams) => {
  const url = getUrl('/groups', filterParams);

  return makeRequest<IGetGroupsResponseBody>(url);
};

export const putGroupRequest = (group: IPutGroupRequestBody) => {
  const url = getUrl(`/groups/${group.id}`);

  return makeRequest(url, group, 'PUT');
};

export const activateGroupRequest = (requestBody: IGroupActionRequestBody) => {
  const url = getUrl(`/groups/${requestBody.id}/activate`);

  return makeRequest(url, requestBody, 'POST');
};

export const dryGroupRequest = (requestBody: IGroupActionRequestBody) => {
  const url = getUrl(`/groups/${requestBody.id}/dry`);

  return makeRequest(url, requestBody, 'POST');
};

export const shutdownGroupRequest = (requestBody: IGroupActionRequestBody) => {
  const url = getUrl(`/groups/${requestBody.id}/shutdown`);

  return makeRequest(url, requestBody, 'POST');
};

export const removeGroupRequest = (requestBody: IGroupActionRequestBody) => {
  const url = getUrl(`/groups/${requestBody.id}`);

  return makeRequest(url, requestBody, 'DELETE');
};

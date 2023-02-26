import { IGetGroupsResponseBody } from './types';
import { getUrl, makeRequest } from '../../services/api';

export const getGroupsRequest = () => {
  const url = getUrl('/voucherPortal/groupNames');

  return makeRequest<IGetGroupsResponseBody>(url);
};

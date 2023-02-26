import {
  IGetSessionLogsRequestBody,
  IGetSessionLogsResponseBody,
  IGetSessionsRequestFiltersParams,
  IGetSessionsResponseBody,
  ITerminateSessionRequestBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const getSessionsRequest = (filterParams: IGetSessionsRequestFiltersParams) => {
  const url = getUrl('/sessions', filterParams);

  return makeRequest<IGetSessionsResponseBody>(url);
};

export const getLogsRequest = ({ session, filterParams }: IGetSessionLogsRequestBody) => {
  const url = getUrl(`/sessions/${session.id}/eventLogs`, filterParams);

  return makeRequest<IGetSessionLogsResponseBody>(url);
};

export const terminateSessionRequest = ({ id }: ITerminateSessionRequestBody) => {
  const url = getUrl(`/sessions/${id}/terminate`);

  return makeRequest(url, undefined, 'POST');
};

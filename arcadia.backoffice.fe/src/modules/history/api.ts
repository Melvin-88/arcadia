import { getUrl, makeRequest } from '../../services/api';
import { IGetHistoryRequestBody, IGetHistoryResponseBody } from './types';

export const getHistoryRequest = ({ historyType, id, filterParams }: IGetHistoryRequestBody) => {
  const url = getUrl(`/history/${historyType}/${id}`, filterParams);

  return makeRequest<IGetHistoryResponseBody>(url);
};

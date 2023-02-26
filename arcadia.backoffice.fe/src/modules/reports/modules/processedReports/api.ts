import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportsFilterParams, IGetProcessedReportsResponseBody } from './types';

export const getProcessedReportsRequest = ({ reportType, filterParams }: IGetProcessedReportsFilterParams) => {
  const url = getUrl(`/report/${reportType}/info`, filterParams);

  return makeRequest<IGetProcessedReportsResponseBody>(url);
};

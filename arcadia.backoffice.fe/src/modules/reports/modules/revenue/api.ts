import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetRevenueReportResponseBody } from './types';

export const getRevenueReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/revenue', filterParams);

  return makeRequest<IGetRevenueReportResponseBody>(url);
};

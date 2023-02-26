import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetActivityReportResponseBody } from './types';

export const getActivityReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/activity', filterParams);

  return makeRequest<IGetActivityReportResponseBody>(url);
};

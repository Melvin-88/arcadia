import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetRetentionReportResponseBody } from './types';

export const getRetentionReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/retention', filterParams);

  return makeRequest<IGetRetentionReportResponseBody>(url);
};

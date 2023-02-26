import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetDisputesReportResponseBody } from './types';

export const getDisputesReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/disputes', filterParams);

  return makeRequest<IGetDisputesReportResponseBody>(url);
};

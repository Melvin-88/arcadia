import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetFunnelReportResponseBody } from './types';

export const getFunnelReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/funnel', filterParams);

  return makeRequest<IGetFunnelReportResponseBody>(url);
};

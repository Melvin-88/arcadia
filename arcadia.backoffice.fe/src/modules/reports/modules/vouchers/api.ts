import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetVouchersReportResponseBody } from './types';

export const getVouchersReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/vouchers', filterParams);

  return makeRequest<IGetVouchersReportResponseBody>(url);
};

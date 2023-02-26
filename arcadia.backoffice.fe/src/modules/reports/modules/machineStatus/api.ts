import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetMachineStatusReportResponseBody } from './types';

export const getMachineStatusReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/machine-status', filterParams);

  return makeRequest<IGetMachineStatusReportResponseBody>(url);
};

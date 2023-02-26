import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetPlayerBlocksReportResponseBody } from './types';

export const getPlayerBlocksReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/player-blocks', filterParams);

  return makeRequest<IGetPlayerBlocksReportResponseBody>(url);
};

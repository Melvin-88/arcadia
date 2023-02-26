import { getUrl, makeRequest } from '../../../../services/api';
import { IGetProcessedReportRequestFiltersParams } from '../../types';
import { IGetPlayerStatsReportResponseBody } from './types';

export const getPlayerStatsReportRequest = (filterParams: IGetProcessedReportRequestFiltersParams) => {
  const url = getUrl('/report/player-stats', filterParams);

  return makeRequest<IGetPlayerStatsReportResponseBody>(url);
};

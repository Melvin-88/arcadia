import {
  IAlertsDismissRequestBody,
  IFlagAlertRequestBody,
  IGetAlertsRequestFiltersParams,
  IGetAlertsResponseBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const getAlertsRequest = (filterParams: IGetAlertsRequestFiltersParams) => {
  const url = getUrl('/alerts', filterParams);

  return makeRequest<IGetAlertsResponseBody>(url);
};

export const dismissAlertRequest = ({ id }: IAlertsDismissRequestBody) => {
  const url = getUrl(`/alerts/${id}/dismiss`);

  return makeRequest(url, undefined, 'POST');
};

export const flagAlertRequest = ({ id }: IFlagAlertRequestBody) => {
  const url = getUrl(`/alerts/${id}/flag`);

  return makeRequest(url, undefined, 'POST');
};

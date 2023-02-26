import { getUrl, makeRequest } from '../../services/api';
import { IGetMaintenanceResponseBody, IGetMaintenanceRequestFiltersParams, AlertId } from './types';

export const getMaintenanceRequest = (filterParams: IGetMaintenanceRequestFiltersParams) => {
  const url = getUrl('/maintenance', filterParams);

  return makeRequest<IGetMaintenanceResponseBody>(url);
};

export const maintenanceFillDispenserRequest = (id: AlertId) => {
  const url = getUrl(`/maintenance/${id}/dispenserFilled`);

  return makeRequest(url, undefined, 'POST');
};

export const maintenanceWaistEmptiedRequest = (id: AlertId) => {
  const url = getUrl(`/maintenance/${id}/waistEmptied`);

  return makeRequest(url, undefined, 'POST');
};

export const maintenanceDismissRequest = (id: AlertId) => {
  const url = getUrl(`/maintenance/${id}/dismiss`);

  return makeRequest(url, undefined, 'POST');
};

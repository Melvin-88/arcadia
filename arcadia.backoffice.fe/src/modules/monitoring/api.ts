import {
  IGetMonitoringRequestFilterParams,
  IGetMonitoringResponseBody,
  IGetOperatorsResponseBody,
  IGetGroupsResponseBody,
  IGetMachinesResponseBody,
  IPostMonitoringRequestBody,
  IPutMonitoringRequestBody,
  IRemoveMonitoringRequestBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const postMonitoringRequest = (data: IPostMonitoringRequestBody) => {
  const url = getUrl('/monitorings');

  return makeRequest(url, data, 'POST');
};

export const getMonitoringRequest = (filterParams: IGetMonitoringRequestFilterParams) => {
  const url = getUrl('/monitorings', filterParams);

  return makeRequest<IGetMonitoringResponseBody>(url);
};

export const putMonitoringRequest = (data: IPutMonitoringRequestBody) => {
  const url = getUrl(`/monitorings/${data.id}`);

  return makeRequest(url, data, 'PUT');
};

export const removeMonitoringRequest = (data: IRemoveMonitoringRequestBody) => {
  const url = getUrl(`/monitorings/${data.id}`);

  return makeRequest(url, data, 'DELETE');
};

export const getOperatorsRequest = () => {
  const url = getUrl('/operators/names');

  return makeRequest<IGetOperatorsResponseBody>(url).then((res) => res.data.operators);
};

export const getGroupsRequest = () => {
  const url = getUrl('/groups/names');

  return makeRequest<IGetGroupsResponseBody>(url).then((res) => res.data.groups);
};

export const getMachinesRequest = () => {
  const url = getUrl('/machines/names');

  return makeRequest<IGetMachinesResponseBody>(url).then((res) => res.data.machines);
};

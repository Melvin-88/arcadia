import {
  IGetMachinesRequestFiltersParams,
  IGetMachinesResponseBody,
  IMachineActionRequestBody,
  IMachineReassignRequestBody,
  IPostMachineRequestBody,
  IPutMachineRequestBody,
  IMachineRebootRequestBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const postMachineRequest = (machine: IPostMachineRequestBody) => {
  const url = getUrl('/machines');

  return makeRequest(url, machine, 'POST');
};

export const getMachinesRequest = (filterParams: IGetMachinesRequestFiltersParams) => {
  const url = getUrl('/machines', filterParams);

  return makeRequest<IGetMachinesResponseBody>(url);
};

export const putMachineRequest = (machine: IPutMachineRequestBody) => {
  const url = getUrl(`/machines/${machine.id}`);

  return makeRequest(url, machine, 'PUT');
};

export const activateMachineRequest = (requestBody: IMachineActionRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}/activate`);

  return makeRequest(url, requestBody, 'POST');
};

export const dryMachineRequest = (requestBody: IMachineActionRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}/dry`);

  return makeRequest(url, requestBody, 'POST');
};

export const shutdownMachineRequest = (requestBody: IMachineActionRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}/shutdown`);

  return makeRequest(url, requestBody, 'POST');
};

export const removeMachineRequest = (requestBody: IMachineActionRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}`);

  return makeRequest(url, requestBody, 'DELETE');
};

export const reassignMachineRequest = (requestBody: IMachineReassignRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}/reassign`);

  return makeRequest(url, requestBody, 'POST');
};

export const rebootMachineRequest = (requestBody: IMachineRebootRequestBody) => {
  const url = getUrl(`/machines/${requestBody.id}/reboot`);

  return makeRequest(url, undefined, 'POST');
};

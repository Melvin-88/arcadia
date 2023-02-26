import { getUrl, makeRequest } from '../../services/api';
import {
  IAdministrationEditPasswordRequestBody,
  IDisableUserRequestBody,
  IDisqualifyChipsPayload,
  IEnableUserRequestBody,
  IFindChipPayload,
  IGetAdministrationRequestFiltersParams,
  IGetAdministrationResponseBody,
  IPostAdministrationRequestBody,
  IPutAdministrationRequestBody,
  IRegisterChipsRequestBody,
  IRemoveUserRequestBody,
  IGetChipsResponseBody,
  IGetUserActionsPayload,
  IUserActionsResponseBody,
} from './types';

export const postAdministrationRequest = (user: IPostAdministrationRequestBody) => {
  const url = getUrl('/administration');

  return makeRequest(url, user, 'POST');
};

export const getAdministrationRequest = (filterParams: IGetAdministrationRequestFiltersParams) => {
  const url = getUrl('/administration', filterParams);

  return makeRequest<IGetAdministrationResponseBody>(url);
};

export const putAdministrationRequest = (user: IPutAdministrationRequestBody) => {
  const url = getUrl(`/administration/${user.id}`);

  return makeRequest(url, user, 'PUT');
};

export const enableUserRequest = (data: IEnableUserRequestBody) => {
  const url = getUrl(`/administration/${data.id}/enable`);

  return makeRequest(url, data, 'POST');
};

export const disableUserRequest = (data: IDisableUserRequestBody) => {
  const url = getUrl(`/administration/${data.id}/disable`);

  return makeRequest(url, data, 'POST');
};

export const removeUserRequest = (data: IRemoveUserRequestBody) => {
  const url = getUrl(`/administration/${data.id}`);

  return makeRequest(url, data, 'DELETE');
};

export const editPasswordRequest = (data: IAdministrationEditPasswordRequestBody) => {
  const url = getUrl(`/administration/${data.id}/changePassword`);

  return makeRequest(url, data, 'POST');
};

export const registerChipsRequest = (data: IRegisterChipsRequestBody) => {
  const url = getUrl('/administration/chip');

  return makeRequest(url, data, 'POST');
};

export const disqualifyChipsRequest = (data: IDisqualifyChipsPayload) => {
  const url = getUrl('/administration/chip/disqualify');

  return makeRequest(url, data, 'PUT');
};

export const findChipRequest = (data: IFindChipPayload) => {
  const url = getUrl('/administration/chip/search', data);

  return makeRequest<IGetChipsResponseBody>(url);
};

export const getUserActionsRequest = (data: IGetUserActionsPayload) => {
  const url = getUrl(`/administration/${data.id}/actions`, data.filterParams);

  return makeRequest<IUserActionsResponseBody>(url);
};

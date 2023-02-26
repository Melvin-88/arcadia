import { getUrl, makeRequest } from '../../services/api';
import {
  IGetCamerasRequestFiltersParams,
  IGetCamerasResponseBody,
  IGetCamerasStreamsRequest,
  IGetCamerasStreamsResponseBody,
  IPostCameraRequestBody,
  IPostCameraResponseBody,
  ICameraActionRequestBody,
  IChangeRecordingRequestBody,
  IGetRecordingRequestBody,
  IGetRecordingResponseBody,
  IGetStreamAuthTokenResponseBody,
} from './types';

export const postCameraRequest = ({ site, camera }: IPostCameraRequestBody) => {
  const url = getUrl(`/cameras/${site}`);

  return makeRequest<IPostCameraResponseBody>(url, camera, 'POST');
};

export const postCameraResetRequest = ({ site, id }: ICameraActionRequestBody) => {
  const url = getUrl(`/cameras/${site}/${id}/reset`);

  return makeRequest(url, undefined, 'POST');
};

export const getCamerasRequest = (filterParams: IGetCamerasRequestFiltersParams) => {
  const url = getUrl('/cameras', filterParams);

  return makeRequest<IGetCamerasResponseBody>(url);
};

export const getCameraStreamsRequest = ({ site, id }: IGetCamerasStreamsRequest) => {
  const url = getUrl(`/cameras/${site}/${id}/streams`);

  return makeRequest<IGetCamerasStreamsResponseBody>(url);
};

export const removeCameraRequest = ({ site, id }: ICameraActionRequestBody) => {
  const url = getUrl(`/cameras/${site}/${id}`);

  return makeRequest(url, undefined, 'DELETE');
};

export const changeRecordingRequest = (data: IChangeRecordingRequestBody) => {
  const url = getUrl(`/cameras/${data.site}/${data.id}/recording`);

  return makeRequest(url, data, 'POST');
};

export const gerRecordingRequest = ({ id, site, ...restData }: IGetRecordingRequestBody) => {
  const url = getUrl(`/cameras/${site}/${id}/recordingUrl`, restData);

  return makeRequest<IGetRecordingResponseBody>(url, undefined, 'GET', { responseType: 'blob' });
};

export const gerStreamAuthTokenRequest = () => {
  const url = getUrl('/cameras/streamAuthToken');

  return makeRequest<IGetStreamAuthTokenResponseBody>(url);
};

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';
import { API_HOST,LocalStorageKeys } from '../../constants';
import { IAPIErrorResponseBody } from './types';

type makeRequest = <T>(
  url: string,
  data?: any,
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE',
  requestConfig?: Partial<AxiosRequestConfig>
) => Promise<AxiosResponse<T>>;

export const getUrl = (path: string, queryParams: { [key: string]: any } = {}): string => {
  const search = queryString.stringify(queryParams);

  return (
    `${API_HOST}${path}${search ? `?${search}` : ''}`
  );
};

export const processApiResponseError = (
  error: AxiosError<IAPIErrorResponseBody>,
  defaultErrorMessage = 'Oops! Something went wrong. Please try again later.',
  additionMessage = '',
) => {
  const { response } = error;
  let errorMessage = defaultErrorMessage;

  if (response) {
    const { data: responseBody } = response;
    const { data } = responseBody;

    errorMessage = data.message;
  }

  if (additionMessage) {
    errorMessage += `\n\n${additionMessage}`;
  }

  // eslint-disable-next-line no-param-reassign
  error.message = errorMessage;

  throw error;
};

export const makeRequest: makeRequest = (url, data, method = 'GET', { headers, ...requestConfig } = {}) => {
  const isFormData = data instanceof FormData;

  const requestHeaders = {
    accept: 'application/json',
    'content-type': isFormData ? 'multipart/form-data' : 'application/json;charset=utf-8',
    Authorization: `Bearer ${localStorage.getItem(LocalStorageKeys.accessToken)}`,
    ...headers,
  };

  const requestConfigProps = {
    headers: requestHeaders,
    method,
    data: isFormData ? data : JSON.stringify(data),
    ...requestConfig,
  };

  return axios(url, requestConfigProps)
    .catch(processApiResponseError);
};

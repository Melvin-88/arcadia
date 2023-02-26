import axios, { AxiosError, AxiosResponse } from 'axios';
import i18next from 'i18next';
import queryString from 'query-string';
import { API_ENDPOINT, SessionStorageKeys } from '../constants';

type makeRequest = <T>(url: string, data?: any, method?: 'POST' | 'GET' | 'PUT' | 'DELETE', headers?: Headers) => Promise<AxiosResponse<T>>;

export const getUrl = (path: string, queryParams: { [key: string]: any } = {}): string => {
  const search = queryString.stringify(queryParams);

  return (
    `${API_ENDPOINT}/api${path}${search ? `?${search}` : ''}`
  );
};

export const processApiResponseError = (
  error: AxiosError,
  defaultErrorMessage = i18next.t('Api.Errors.TryAgainLater'),
  additionMessage = '',
) => {
  const { response } = error;

  let errorMessage = defaultErrorMessage;

  if (response) {
    errorMessage = response.data?.data?.message || errorMessage;
  }

  if (additionMessage) {
    errorMessage += `\n\n${additionMessage}`;
  }

  // eslint-disable-next-line no-param-reassign
  error.message = errorMessage;

  throw error;
};

export const makeRequest: makeRequest = (url, data, method = 'GET', headers = undefined) => {
  const requestHeaders = {
    accept: 'application/json',
    'content-type': 'application/json;charset=utf-8',
    Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.accessToken)}`,
    ...headers,
  };

  const requestConfig = {
    headers: requestHeaders,
    method,
    data: JSON.stringify(data),
  };

  return axios(url, requestConfig)
    .catch(processApiResponseError);
};

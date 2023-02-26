import { AxiosResponse } from 'axios';

export function dataToAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    config: undefined,
    headers: undefined,
    statusText: '',
    data,
    status: 201,
  };
}
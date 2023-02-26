import { IGetVouchersRequestFiltersParams, IGetVouchersResponseBody } from 'arcadia-common-fe';
import { getUrl, makeRequest } from '../../services/api';
import { IPostVouchersResponseBody, IPostVoucherRequestBody } from './types';

export const postVoucherRequest = (voucher: IPostVoucherRequestBody) => {
  const url = getUrl('/voucherPortal');

  return makeRequest<IPostVouchersResponseBody>(url, voucher, 'POST');
};

export const getVouchersRequest = (filtersParams: IGetVouchersRequestFiltersParams) => {
  const url = getUrl('/voucherPortal', filtersParams);

  return makeRequest<IGetVouchersResponseBody>(url);
};

export const getStatisticsRequest = () => {
  const url = getUrl('/voucherPortal/statistics');

  return makeRequest<IGetVouchersResponseBody>(url);
};

import { IGetVouchersResponseBody, IGetVouchersRequestFiltersParams } from 'arcadia-common-fe';
import { getUrl, makeRequest } from '../../services/api';
import { IVoucherRevokeRequest } from './types';

export const getVouchersRequest = (filterParams: IGetVouchersRequestFiltersParams) => {
  const url = getUrl('/vouchers', filterParams);

  return makeRequest<IGetVouchersResponseBody>(url);
};

export const voucherRevokeRequest = (data: IVoucherRevokeRequest) => {
  const url = getUrl(`/vouchers/${data.id}`);

  return makeRequest(url, data, 'DELETE');
};

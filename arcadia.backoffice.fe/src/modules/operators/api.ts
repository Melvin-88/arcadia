import { getUrl, makeRequest } from '../../services/api';
import {
  IGetOperatorsRequestFilterParams,
  IGetOperatorsResponseBody,
  ILogoOperatorUploadRequestBody,
  ILogoOperatorUploadResponseBody,
  IOperatorActionRequestBody,
  IPostOperatorRequestBody,
  IPostOperatorResponseBody,
  IPutOperatorRequestBody,
  IPutOperatorResponseBody,
} from './types';

export const postOperatorsRequest = (operator: IPostOperatorRequestBody) => {
  const url = getUrl('/operators');

  return makeRequest<IPostOperatorResponseBody>(url, operator, 'POST');
};

export const getOperatorsRequest = (filterParams: IGetOperatorsRequestFilterParams) => {
  const url = getUrl('/operators', filterParams);

  return makeRequest<IGetOperatorsResponseBody>(url);
};

export const putOperatorsRequest = (operator: IPutOperatorRequestBody) => {
  const url = getUrl(`/operators/${operator.id}`);

  return makeRequest<IPutOperatorResponseBody>(url, operator, 'PUT');
};

export const enableOperatorRequest = (operator: IOperatorActionRequestBody) => {
  const url = getUrl(`/operators/${operator.id}/enable`);

  return makeRequest(url, operator, 'POST');
};

export const disableOperatorRequest = (operator: IOperatorActionRequestBody) => {
  const url = getUrl(`/operators/${operator.id}/disable`);

  return makeRequest(url, operator, 'POST');
};

export const removeOperatorRequest = (operator: IOperatorActionRequestBody) => {
  const url = getUrl(`/operators/${operator.id}`);

  return makeRequest(url, operator, 'DELETE');
};

export const logoOperatorUploadRequest = (data: ILogoOperatorUploadRequestBody) => {
  const url = getUrl('/operators/logo');

  return makeRequest<ILogoOperatorUploadResponseBody>(url, data, 'POST');
};

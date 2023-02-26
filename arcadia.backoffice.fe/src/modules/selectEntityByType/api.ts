import {
  IGetGroupsResponseBody,
  IGetOperatorsResponseBody,
  IGetLocationResponseBody,
  IGetSitesResponseBody,
  IGetMachinesResponseBody,
  IGetDenominatorResponseBody,
  IGetBlockingReasonsResponseBody,
  IGetChipTypesResponseBody,
  IGetMonitoringMetricsResponseBody,
  IGetMonitoringDimensionResponseBody,
  IGetRebateCurrenciesResponseBody,
  IGetPrizeGroupsResponseBody,
  IGetPowerLinesResponseBody,
} from './types';
import { getUrl, makeRequest } from '../../services/api';

export const getGroupsRequest = () => {
  const url = getUrl('/groups/names');

  return makeRequest<IGetGroupsResponseBody>(url);
};

export const getOperatorsRequest = () => {
  const url = getUrl('/operators/names');

  return makeRequest<IGetOperatorsResponseBody>(url);
};

export const getMachinesRequest = () => {
  const url = getUrl('/machines/names');

  return makeRequest<IGetMachinesResponseBody>(url);
};

export const getLocationRequest = () => {
  const url = getUrl('/cameras/locations');

  return makeRequest<IGetLocationResponseBody>(url);
};

export const getSitesRequest = () => {
  const url = getUrl('/machines/sites');

  return makeRequest<IGetSitesResponseBody>(url);
};

export const getCamerasSitesRequest = () => {
  const url = getUrl('/cameras/sites');

  return makeRequest<IGetSitesResponseBody>(url);
};

export const getBlockingReasonRequest = () => {
  const url = getUrl('/players/blockReasons');

  return makeRequest<IGetBlockingReasonsResponseBody>(url);
};

export const getDenominatorRequest = () => {
  const url = getUrl('/groups/denominator-values');

  return makeRequest<IGetDenominatorResponseBody>(url);
};

export const getChipTypesRequest = () => {
  const url = getUrl('/administration/chip/types');

  return makeRequest<IGetChipTypesResponseBody>(url);
};

export const getMonitoringMetricsRequest = () => {
  const url = getUrl('/monitorings/metrics');

  return makeRequest<IGetMonitoringMetricsResponseBody>(url);
};

export const getMonitoringDimensionRequest = () => {
  const url = getUrl('/monitorings/dimensions');

  return makeRequest<IGetMonitoringDimensionResponseBody>(url);
};

export const getRebateCurrenciesRequest = () => {
  const url = getUrl('/disputes/rebateCurrencies');

  return makeRequest<IGetRebateCurrenciesResponseBody>(url);
};

export const getPrizeGroupsRequest = () => {
  const url = getUrl('/groups/prize-groups');

  return makeRequest<IGetPrizeGroupsResponseBody>(url);
};

export const getPowerLinesRequest = () => {
  const url = getUrl('/machines/power-lines');

  return makeRequest<IGetPowerLinesResponseBody>(url);
};

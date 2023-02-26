import { getUrl, makeRequest } from '../../services/api';
import {
  ICurrentActivesResponseBody,
  IActiveSessionsBreakdownResponseBody,
  IPlayersPerDayResponseBody,
  IActiveAndNewPlayersResponseBody,
  IBettingActivityResponseBody,
  ITopWinnersAndLosersResponseBody,
  IWaitTimeResponseBody,
  IMachinesAvailabilityResponseBody,
  IMachinesStatusResponseBody,
  ILatestAlertsResponseBody,
  IGroupsResponseBody,
  IDashboardRequestGroupIdFilterParams,
} from './types';

export const getGroupsRequest = () => {
  const url = getUrl('/groups/names');

  return makeRequest<IGroupsResponseBody>(url);
};

export const getPlayersPerDayRequest = () => {
  const url = getUrl('/dashboard/activeNewPlayers');

  return makeRequest<IPlayersPerDayResponseBody>(url);
};

export const getCurrentActivesRequest = () => {
  const url = getUrl('/dashboard/existingNewPlayers');

  return makeRequest<ICurrentActivesResponseBody>(url);
};

export const getActiveSessionsBreakdownRequest = () => {
  const url = getUrl('/dashboard/activeSessionsBreakdown');

  return makeRequest<IActiveSessionsBreakdownResponseBody>(url);
};

export const getActiveAndNewPlayersRequest = () => {
  const url = getUrl('/dashboard/30daysActiveNewPlayers');

  return makeRequest<IActiveAndNewPlayersResponseBody>(url);
};

export const getBettingActivityRequest = () => {
  const url = getUrl('/dashboard/bettingActivity');

  return makeRequest<IBettingActivityResponseBody>(url);
};

export const getTopWinnersAndLosersRequest = () => {
  const url = getUrl('/dashboard/topWinnersLosers');

  return makeRequest<ITopWinnersAndLosersResponseBody>(url);
};

export const getWaitTimeRequest = (filterParams: IDashboardRequestGroupIdFilterParams) => {
  const url = getUrl('/dashboard/waitTime', filterParams);

  return makeRequest<IWaitTimeResponseBody>(url);
};

export const getMachineAvailabilityRequest = (filterParams: IDashboardRequestGroupIdFilterParams) => {
  const url = getUrl('/dashboard/machineAvailability', filterParams);

  return makeRequest<IMachinesAvailabilityResponseBody>(url);
};

export const getMachinesStatusRequest = (filterParams: IDashboardRequestGroupIdFilterParams) => {
  const url = getUrl('/dashboard/machinesStatus', filterParams);

  return makeRequest<IMachinesStatusResponseBody>(url);
};

export const getLatestAlertsRequest = () => {
  const url = getUrl('/dashboard/latestAlerts');

  return makeRequest<ILatestAlertsResponseBody>(url);
};

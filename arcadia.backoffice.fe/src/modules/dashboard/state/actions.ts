import { createAction } from '@reduxjs/toolkit';
import {
  IActiveSessionsBreakdownResponseBody,
  IBettingActivityResponseBody,
  ICurrentActivesResponseBody,
  IActiveAndNewPlayersResponseBody,
  IPlayersPerDayResponseBody,
  ITopWinnersAndLosersResponseBody,
  IWaitTimeResponseBody,
  IMachinesAvailabilityResponseBody,
  IMachinesStatusResponseBody,
  ILatestAlertsResponseBody,
  IGroupsResponseBody,
  IDashboardRequestGroupIdFilterParams,
} from '../types';

export const getGroups = createAction('DASHBOARD/GET_GROUPS');
export const getGroupsSuccess = createAction<IGroupsResponseBody>('DASHBOARD/GET_GROUPS/SUCCESS');
export const getGroupsError = createAction('DASHBOARD/GET_GROUPS/ERROR');

export const getPlayersPerDay = createAction('DASHBOARD/GET_PLAYERS_PER_DAY');
export const getPlayersPerDaySuccess = createAction<IPlayersPerDayResponseBody>('DASHBOARD/GET_PLAYERS_PER_DAY/SUCCESS');
export const getPlayersPerDayError = createAction('DASHBOARD/GET_PLAYERS_PER_DAY/ERROR');

export const getCurrentActives = createAction('DASHBOARD/GET_CURRENT_ACTIVES');
export const getCurrentActivesSuccess = createAction<ICurrentActivesResponseBody>('DASHBOARD/GET_CURRENT_ACTIVES/SUCCESS');
export const getCurrentActivesError = createAction('DASHBOARD/GET_CURRENT_ACTIVES/ERROR');

export const getActiveSessionsBreakdown = createAction('DASHBOARD/GET_ACTIVE_SESSIONS_BREAKDOWN');
export const getActiveSessionsBreakdownSuccess = createAction<IActiveSessionsBreakdownResponseBody>(
  'DASHBOARD/GET_ACTIVE_SESSIONS_BREAKDOWN/SUCCESS',
);
export const getActiveSessionsBreakdownError = createAction('DASHBOARD/GET_ACTIVE_SESSIONS_BREAKDOWN/ERROR');

export const seWaitTimeFilterValues = createAction<IDashboardRequestGroupIdFilterParams>(
  'DASHBOARD/SET_WAIT_TIME_FILTER_VALUES',
);
export const getWaitTime = createAction<IDashboardRequestGroupIdFilterParams>('DASHBOARD/GET_WAIT_TIME');
export const getWaitTimeSuccess = createAction<IWaitTimeResponseBody>('DASHBOARD/GET_WAIT_TIME/SUCCESS');
export const getWaitTimeError = createAction('DASHBOARD/GET_WAIT_TIME/ERROR');

export const setMachineAvailabilityFilterValues = createAction<IDashboardRequestGroupIdFilterParams>(
  'DASHBOARD/SET_MACHINE_AVAILABILITY_FILTER_VALUES',
);
export const getMachineAvailability = createAction<IDashboardRequestGroupIdFilterParams>('DASHBOARD/GET_MACHINE_AVAILABILITY');
export const getMachineAvailabilitySuccess = createAction<IMachinesAvailabilityResponseBody>('DASHBOARD/GET_MACHINE_AVAILABILITY/SUCCESS');
export const getMachineAvailabilityError = createAction('DASHBOARD/GET_MACHINE_AVAILABILITY/ERROR');

export const setMachineStatusFilterValues = createAction<IDashboardRequestGroupIdFilterParams>(
  'DASHBOARD/SET_MACHINE_STATUS_FILTER_VALUES',
);
export const getMachinesStatus = createAction<IDashboardRequestGroupIdFilterParams>('DASHBOARD/GET_MACHINES_STATUS');
export const getMachinesStatusSuccess = createAction<IMachinesStatusResponseBody>('DASHBOARD/GET_MACHINES_STATUS/SUCCESS');
export const getMachinesStatusError = createAction('DASHBOARD/GET_MACHINES_STATUS/ERROR');

export const getLatestAlerts = createAction('DASHBOARD/GET_LATEST_ALERTS');
export const getLatestAlertsSuccess = createAction<ILatestAlertsResponseBody>('DASHBOARD/GET_LATEST_ALERTS/SUCCESS');
export const getLatestAlertsError = createAction('DASHBOARD/GET_LATEST_ALERTS/ERROR');

export const getActiveAndNewPlayers = createAction('DASHBOARD/GET_ACTIVE_AND_NEW_PLAYERS');
export const getActiveAndNewPlayersSuccess = createAction<IActiveAndNewPlayersResponseBody>(
  'DASHBOARD/GET_ACTIVE_AND_NEW_PLAYERS/SUCCESS',
);
export const getActiveAndNewPlayersError = createAction('DASHBOARD/GET_ACTIVE_AND_NEW_PLAYERS/ERROR');

export const getBettingActivity = createAction('DASHBOARD/GET_BETTING_ACTIVITY');
export const getBettingActivitySuccess = createAction<IBettingActivityResponseBody>(
  'DASHBOARD/GET_BETTING_ACTIVITY/SUCCESS',
);
export const getBettingActivityError = createAction('DASHBOARD/GET_BETTING_ACTIVITY/ERROR');

export const getTopWinnersAndLosers = createAction('DASHBOARD/GET_TOP_WINNERS_AND_LOSERS');
export const getTopWinnersAndLosersSuccess = createAction<ITopWinnersAndLosersResponseBody>(
  'DASHBOARD/GET_TOP_WINNERS_AND_LOSERS/SUCCESS',
);
export const getTopWinnersAndLosersError = createAction('DASHBOARD/GET_TOP_WINNERS_AND_LOSERS/ERROR');

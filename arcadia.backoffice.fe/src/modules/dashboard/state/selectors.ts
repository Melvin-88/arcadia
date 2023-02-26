import { IDashboardSlice } from '../types';

export const dashboardPlayersPerDaySelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.playersPerDay;

export const dashboardCurrentActivesSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.currentActives;

export const dashboardActiveSessionsBreakdownSelector = ({ dashboardReducer }: IDashboardSlice) => (
  dashboardReducer.activeSessionsBreakdown
);

export const activeAndNewPlayersSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.activeAndNewPlayers;

export const bettingActivitySelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.bettingActivity;

export const topWinnersAndLosersSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.topWinnersAndLosers;

export const waitTimeSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.waitTime;

export const machineAvailabilitySelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.machineAvailability;

export const machinesStatusSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.machinesStatus;

export const latestAlertsSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.latestAlerts;

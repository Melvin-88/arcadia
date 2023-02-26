import { createReducer } from '@reduxjs/toolkit';
import { IDashboardReducer } from '../types';
import {
  getPlayersPerDay,
  getPlayersPerDaySuccess,
  getPlayersPerDayError,
  getCurrentActivesError,
  getCurrentActivesSuccess,
  getCurrentActives,
  getActiveSessionsBreakdownError,
  getActiveSessionsBreakdownSuccess,
  getActiveSessionsBreakdown,
  getActiveAndNewPlayersError,
  getActiveAndNewPlayersSuccess,
  getActiveAndNewPlayers,
  getBettingActivityError,
  getBettingActivitySuccess,
  getBettingActivity,
  getTopWinnersAndLosersError,
  getTopWinnersAndLosersSuccess,
  getTopWinnersAndLosers,
  getWaitTimeError,
  getWaitTimeSuccess,
  getWaitTime,
  getMachineAvailabilitySuccess,
  getMachineAvailability,
  getMachineAvailabilityError,
  getMachinesStatusSuccess,
  getMachinesStatus,
  getMachinesStatusError,
  getLatestAlertsSuccess,
  getLatestAlerts,
  getLatestAlertsError,
  getGroupsSuccess,
  seWaitTimeFilterValues,
  setMachineAvailabilityFilterValues,
  setMachineStatusFilterValues,
} from './actions';

export const initialState: IDashboardReducer = {
  playersPerDay: {
    isLoading: false,
    countActive: 0,
    countActivePrevious: 0,
    countNew: 0,
    countNewPrevious: 0,
  },
  currentActives: {
    isLoading: false,
    countExisting: 0,
    countNew: 0,
  },
  activeSessionsBreakdown: {
    isLoading: false,
    countObserving: 0,
    countQueuing: 0,
    countBetBehind: 0,
    countInPlay: 0,
    countReBuy: 0,
  },
  activeAndNewPlayers: {
    isLoading: false,
    stats: [],
  },
  bettingActivity: {
    isLoading: false,
    bets: [],
  },
  topWinnersAndLosers: {
    isLoading: false,
    winners: [],
    losers: [],
  },
  waitTime: {
    isLoading: false,
    averageWaitTimeCurrent: 0,
    averageWaitTime24: 0,
    averageWaitTime24Previous: 0,
  },
  machineAvailability: {
    isLoading: false,
    countInPlay: 0,
    countReady: 0,
  },
  machinesStatus: {
    isLoading: false,
    countError: 0,
    countOffline: 0,
    countShuttingDown: 0,
    countDrying: 0,
    countPreparing: 0,
    countInPlay: 0,
    countSeeding: 0,
    countReady: 0,
  },
  latestAlerts: {
    isLoading: false,
    alerts: [],
  },
};

export const dashboardReducer = createReducer(initialState, (builder) => {
  builder.addCase(getGroupsSuccess, (state, { payload }) => {
    const groupIds = payload.groups.map((group) => group.id);
    const filterValues = { groupId: groupIds };

    return ({
      ...state,
      machineAvailability: {
        ...state.machineAvailability,
        filterValues,
      },
      waitTime: {
        ...state.waitTime,
        filterValues,
      },
      machinesStatus: {
        ...state.machinesStatus,
        filterValues,
      },
    });
  });

  builder.addCase(getPlayersPerDay, (state) => ({
    ...state,
    playersPerDay: {
      ...state.playersPerDay,
      isLoading: true,
    },
  }));
  builder.addCase(getPlayersPerDaySuccess, (state, { payload }) => ({
    ...state,
    playersPerDay: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getPlayersPerDayError, (state) => ({
    ...state,
    playersPerDay: {
      ...state.playersPerDay,
      isLoading: false,
    },
  }));

  builder.addCase(getCurrentActives, (state) => ({
    ...state,
    currentActives: {
      ...state.currentActives,
      isLoading: true,
    },
  }));
  builder.addCase(getCurrentActivesSuccess, (state, { payload }) => ({
    ...state,
    currentActives: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getCurrentActivesError, (state) => ({
    ...state,
    currentActives: {
      ...state.currentActives,
      isLoading: false,
    },
  }));

  builder.addCase(getActiveSessionsBreakdown, (state) => ({
    ...state,
    activeSessionsBreakdown: {
      ...state.activeSessionsBreakdown,
      isLoading: true,
    },
  }));
  builder.addCase(getActiveSessionsBreakdownSuccess, (state, { payload }) => ({
    ...state,
    activeSessionsBreakdown: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getActiveSessionsBreakdownError, (state) => ({
    ...state,
    activeSessionsBreakdown: {
      ...state.activeSessionsBreakdown,
      isLoading: false,
    },
  }));

  builder.addCase(getActiveAndNewPlayers, (state) => ({
    ...state,
    activeAndNewPlayers: {
      ...state.activeAndNewPlayers,
      isLoading: true,
    },
  }));
  builder.addCase(getActiveAndNewPlayersSuccess, (state, { payload }) => ({
    ...state,
    activeAndNewPlayers: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getActiveAndNewPlayersError, (state) => ({
    ...state,
    activeAndNewPlayers: {
      ...state.activeAndNewPlayers,
      isLoading: false,
    },
  }));

  builder.addCase(getBettingActivity, (state) => ({
    ...state,
    bettingActivity: {
      ...state.bettingActivity,
      isLoading: true,
    },
  }));
  builder.addCase(getBettingActivitySuccess, (state, { payload }) => ({
    ...state,
    bettingActivity: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getBettingActivityError, (state) => ({
    ...state,
    bettingActivity: {
      ...state.bettingActivity,
      isLoading: false,
    },
  }));

  builder.addCase(getTopWinnersAndLosers, (state) => ({
    ...state,
    topWinnersAndLosers: {
      ...state.topWinnersAndLosers,
      isLoading: true,
    },
  }));
  builder.addCase(getTopWinnersAndLosersSuccess, (state, { payload }) => ({
    ...state,
    topWinnersAndLosers: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getTopWinnersAndLosersError, (state) => ({
    ...state,
    topWinnersAndLosers: {
      ...state.topWinnersAndLosers,
      isLoading: false,
    },
  }));

  builder.addCase(seWaitTimeFilterValues, (state, { payload }) => ({
    ...state,
    waitTime: {
      ...state.waitTime,
      filterValues: payload,
    },
  }));
  builder.addCase(getWaitTime, (state, { payload }) => ({
    ...state,
    waitTime: {
      ...state.waitTime,
      filterValues: payload,
      isLoading: true,
    },
  }));
  builder.addCase(getWaitTimeSuccess, (state, { payload }) => ({
    ...state,
    waitTime: {
      ...state.waitTime,
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getWaitTimeError, (state) => ({
    ...state,
    waitTime: {
      ...state.waitTime,
      isLoading: false,
    },
  }));

  builder.addCase(setMachineAvailabilityFilterValues, (state, { payload }) => ({
    ...state,
    machineAvailability: {
      ...state.machineAvailability,
      filterValues: payload,
    },
  }));
  builder.addCase(getMachineAvailability, (state, { payload }) => ({
    ...state,
    machineAvailability: {
      ...state.machineAvailability,
      filterValues: payload,
      isLoading: true,
    },
  }));
  builder.addCase(getMachineAvailabilitySuccess, (state, { payload }) => ({
    ...state,
    machineAvailability: {
      ...state.machineAvailability,
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getMachineAvailabilityError, (state) => ({
    ...state,
    machineAvailability: {
      ...state.machineAvailability,
      isLoading: false,
    },
  }));

  builder.addCase(setMachineStatusFilterValues, (state, { payload }) => ({
    ...state,
    machinesStatus: {
      ...state.machinesStatus,
      filterValues: payload,
    },
  }));
  builder.addCase(getMachinesStatus, (state, { payload }) => ({
    ...state,
    machinesStatus: {
      ...state.machinesStatus,
      filterValues: payload,
      isLoading: true,
    },
  }));
  builder.addCase(getMachinesStatusSuccess, (state, { payload }) => ({
    ...state,
    machinesStatus: {
      ...state.machinesStatus,
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getMachinesStatusError, (state) => ({
    ...state,
    machinesStatus: {
      ...state.machinesStatus,
      isLoading: false,
    },
  }));

  builder.addCase(getLatestAlerts, (state) => ({
    ...state,
    latestAlerts: {
      ...state.latestAlerts,
      isLoading: true,
    },
  }));
  builder.addCase(getLatestAlertsSuccess, (state, { payload }) => ({
    ...state,
    latestAlerts: {
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getLatestAlertsError, (state) => ({
    ...state,
    latestAlerts: {
      ...state.latestAlerts,
      isLoading: false,
    },
  }));
});

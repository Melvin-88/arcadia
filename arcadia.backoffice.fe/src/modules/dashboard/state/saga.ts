import {
  all, put, takeLatest,
} from 'redux-saga/effects';
import {
  getGroups,
  getGroupsError,
  getGroupsSuccess,
  getActiveSessionsBreakdown,
  getActiveSessionsBreakdownError,
  getActiveSessionsBreakdownSuccess,
  getCurrentActives,
  getCurrentActivesError,
  getCurrentActivesSuccess,
  getActiveAndNewPlayers,
  getActiveAndNewPlayersError,
  getPlayersPerDay,
  getPlayersPerDayError,
  getPlayersPerDaySuccess,
  getActiveAndNewPlayersSuccess,
  getBettingActivity,
  getBettingActivityError,
  getBettingActivitySuccess,
  getTopWinnersAndLosers,
  getTopWinnersAndLosersError,
  getTopWinnersAndLosersSuccess,
  getWaitTime,
  getWaitTimeError,
  getWaitTimeSuccess,
  getMachineAvailability,
  getMachineAvailabilityError,
  getMachineAvailabilitySuccess,
  getMachinesStatus,
  getMachinesStatusError,
  getMachinesStatusSuccess,
  getLatestAlerts,
  getLatestAlertsError,
  getLatestAlertsSuccess,
} from './actions';
import {
  getGroupsRequest,
  getActiveSessionsBreakdownRequest,
  getCurrentActivesRequest,
  getActiveAndNewPlayersRequest,
  getPlayersPerDayRequest,
  getBettingActivityRequest,
  getTopWinnersAndLosersRequest,
  getWaitTimeRequest,
  getMachineAvailabilityRequest,
  getMachinesStatusRequest,
  getLatestAlertsRequest,
} from '../api';
import { handleError } from '../../../services/sagasErrorHandler';

function* handleGetGroups() {
  try {
    const { data } = yield getGroupsRequest();

    yield put(getGroupsSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getGroupsError());
  }
}

function* handleGetPlayersPerDay() {
  try {
    const { data } = yield getPlayersPerDayRequest();

    yield put(getPlayersPerDaySuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getPlayersPerDayError());
  }
}

function* handleGetCurrentActives() {
  try {
    const { data } = yield getCurrentActivesRequest();

    yield put(getCurrentActivesSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getCurrentActivesError());
  }
}

function* handleGetActiveSessionsBreakdown() {
  try {
    const { data } = yield getActiveSessionsBreakdownRequest();

    yield put(getActiveSessionsBreakdownSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getActiveSessionsBreakdownError());
  }
}

function* handleGetActiveAndNewPlayers() {
  try {
    const { data } = yield getActiveAndNewPlayersRequest();

    yield put(getActiveAndNewPlayersSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getActiveAndNewPlayersError());
  }
}

function* handleGetBettingActivity() {
  try {
    const { data } = yield getBettingActivityRequest();

    yield put(getBettingActivitySuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getBettingActivityError());
  }
}

function* handleGetTopWinnersAndLosers() {
  try {
    const { data } = yield getTopWinnersAndLosersRequest();

    yield put(getTopWinnersAndLosersSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getTopWinnersAndLosersError());
  }
}

function* handleGetWaitTime({ payload }: ReturnType<typeof getWaitTime>) {
  try {
    const { data } = yield getWaitTimeRequest(payload);

    yield put(getWaitTimeSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getWaitTimeError());
  }
}

function* handleGetMachineAvailability({ payload }: ReturnType<typeof getMachineAvailability>) {
  try {
    const { data } = yield getMachineAvailabilityRequest(payload);

    yield put(getMachineAvailabilitySuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getMachineAvailabilityError());
  }
}

function* handleGetMachinesStatus({ payload }: ReturnType<typeof getMachinesStatus>) {
  try {
    const { data } = yield getMachinesStatusRequest(payload);

    yield put(getMachinesStatusSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getMachinesStatusError());
  }
}

function* handleGetLatestAlerts() {
  try {
    const { data } = yield getLatestAlertsRequest();

    yield put(getLatestAlertsSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getLatestAlertsError());
  }
}

export function* dashboardSagas() {
  yield all([
    yield takeLatest(
      getGroups,
      handleGetGroups,
    ),
    yield takeLatest(
      getPlayersPerDay,
      handleGetPlayersPerDay,
    ),
    yield takeLatest(
      getCurrentActives,
      handleGetCurrentActives,
    ),
    yield takeLatest(
      getActiveSessionsBreakdown,
      handleGetActiveSessionsBreakdown,
    ),
    yield takeLatest(
      getActiveAndNewPlayers,
      handleGetActiveAndNewPlayers,
    ),
    yield takeLatest(
      getBettingActivity,
      handleGetBettingActivity,
    ),
    yield takeLatest(
      getTopWinnersAndLosers,
      handleGetTopWinnersAndLosers,
    ),
    yield takeLatest(
      getWaitTime,
      handleGetWaitTime,
    ),
    yield takeLatest(
      getMachineAvailability,
      handleGetMachineAvailability,
    ),
    yield takeLatest(
      getMachinesStatus,
      handleGetMachinesStatus,
    ),
    yield takeLatest(
      getLatestAlerts,
      handleGetLatestAlerts,
    ),
  ]);
}

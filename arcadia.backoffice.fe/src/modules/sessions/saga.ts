import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import {
  formatSecondsToMinutesSeconds,
  getDateTimeFormatted,
  formatDenominator,
  saveStringAsFile,
  convertDataToJSON,
} from 'arcadia-common-fe';
import { handleError } from '../../services/sagasErrorHandler';
import {
  getSessions,
  getSessionsSuccess,
  getSessionsError,
  exportSessions,
  exportSessionsSuccess,
  exportSessionsError,
  getLogs,
  getLogsSuccess,
  getLogsError,
  terminateSession,
  terminateSessionError,
  terminateSessionSuccess,
  exportSessionLogs,
  exportSessionLogsError,
  exportSessionLogsSuccess,
} from './actions';
import {
  getSessionsRequest,
  getLogsRequest,
  terminateSessionRequest,
} from './api';
import { IGetSessionsRequestFiltersParams, IGetSessionsResponseBody, ISessionLogItem } from './types';
import { sessionLogSourceLabelMap, sessionsLabelMap } from './constants';

function* handleRefreshSessions() {
  yield put(getSessions(queryString.parse(window.location.search)));
}

function* handleGetSessionsRequest(requestParams: IGetSessionsRequestFiltersParams) {
  const { data } = yield call(getSessionsRequest, requestParams);

  return data;
}

function* handleGetSessions({ payload }: ReturnType<typeof getSessions>) {
  try {
    const sessionsData: IGetSessionsResponseBody = yield handleGetSessionsRequest(payload);

    yield put(getSessionsSuccess(sessionsData));
  } catch (error) {
    yield handleError(error);
    yield put(getSessionsError());
  }
}

function* handleExportSessions({ payload }: ReturnType<typeof exportSessions>) {
  try {
    const { sessions }: IGetSessionsResponseBody = yield handleGetSessionsRequest(payload);

    const preparedData = sessions.map((session) => ({
      Status: sessionsLabelMap[session.status],
      'Session ID': session.id,
      'Group Name': session.groupName,
      'Machine ID': session.machineId,
      'Operator Name': session.operatorName,
      'Player CID': session.playerCid,
      'IP Address': session.ip,
      'Start Date & Time': getDateTimeFormatted(session.startDate),
      Duration: session.duration,
      Rounds: session.rounds,
      'Total Winning': formatDenominator(session.totalWinning),
      'Total Netgaming': formatDenominator(session.totalNetCash),
      'Viewer duration': formatSecondsToMinutesSeconds(session.viewerDuration),
      'Queue duration': formatSecondsToMinutesSeconds(session.queueDuration),
      'Total bets': session.totalBets,
      'Total stacks used': session.totalStacksUsed,
      Currency: session.currency,
      'Game client version': session.clientVersion,
      'OS (and version)': session.os,
      'Device type': session.deviceType,
      Browser: session.browser,
      'Group settings': session.groupDetails,
      'Operator settings': session.operationDetails,
      'System settings': session.systemConfigs,
      'Video link': session.videoUrl,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'sessions.csv');
    yield put(exportSessionsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportSessionsError());
  }
}

function* handleGetLogs({ payload }: ReturnType<typeof getLogs>) {
  try {
    const { data } = yield call(getLogsRequest, payload);

    yield put(getLogsSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getLogsError());
  }
}

function* handleExportSessionLogs({ payload }: ReturnType<typeof exportSessionLogs>) {
  try {
    const { data } = yield getLogsRequest(payload);

    const preparedData = data.logs.map((row: ISessionLogItem) => ({
      Player: payload.session.playerCid,
      Group: payload.session.groupName,
      Start: getDateTimeFormatted(payload.session.startDate),
      'Created Date': getDateTimeFormatted(row.createdDate),
      Source: sessionLogSourceLabelMap[row.source],
      Type: row.type,
      Parameters: convertDataToJSON(row.parameters),
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, `arcadia_session_${payload.session.id}.csv`);
    yield put(exportSessionLogsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportSessionLogsError());
  }
}

function* handleTerminateSession({ payload }: ReturnType<typeof terminateSession>) {
  try {
    yield call(terminateSessionRequest, payload);

    yield call(toast.success, `The session with id ${payload.id} has been terminated`);
    yield put(terminateSessionSuccess());
    yield handleRefreshSessions();
  } catch (error) {
    yield handleError(error);
    yield put(terminateSessionError());
  }
}

export function* sessionsSagas() {
  yield all([
    yield takeLatest(
      getSessions,
      handleGetSessions,
    ),
    yield takeLatest(
      exportSessions,
      handleExportSessions,
    ),
    yield takeLatest(
      getLogs,
      handleGetLogs,
    ),
    yield takeLatest(
      exportSessionLogs,
      handleExportSessionLogs,
    ),
    yield takeLatest(
      terminateSession,
      handleTerminateSession,
    ),
  ]);
}

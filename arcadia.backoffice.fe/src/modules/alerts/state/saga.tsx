import {
  all, call, put, select, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import React from 'react';
import { covertBooleanToYesNo, getDateTimeFormatted, saveStringAsFile } from 'arcadia-common-fe';
import { normalize, schema } from 'normalizr';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  dismissAlerts,
  flagAlerts,
  exportAlerts,
  exportAlertsError,
  exportAlertsSuccess,
  getAlerts,
  getAlertsError,
  getAlertsSuccess,
  mergeDismissDialog,
  setDismissDialog,
  setSelectedAlerts,
  checkAlertsToRefresh,
} from './actions';
import {
  getAlertsRequest, dismissAlertRequest, flagAlertRequest,
} from '../api';
import {
  IAlerts, IGetAlertsNormalizedData, IGetAlertsRequestFiltersParams, IGetAlertsResponseBody,
} from '../types';
import { alertStatusLabelMap } from '../constants';
import { alertsReducerSelector } from './selectors';
import { AlertsRefreshToast } from '../components/AlertsRefreshToast/AlertsRefreshToast';

const alertsSchema = new schema.Entity('alerts');
const alertsListSchema = new schema.Array(alertsSchema);

function* handleGetAlertsRequest(requestParams: IGetAlertsRequestFiltersParams) {
  const { data } = yield call(getAlertsRequest, requestParams);

  const { result: alertsIds, entities } = normalize<IAlerts>(data.alerts, alertsListSchema);

  return {
    ids: alertsIds,
    entities: entities.alerts,
    total: data.total,
  };
}

function* handleRefreshAlerts() {
  yield put(getAlerts(queryString.parse(window.location.search)));
}

function* handleGetAlerts({ payload }: ReturnType<typeof getAlerts>) {
  try {
    const alertsData: IGetAlertsResponseBody = yield handleGetAlertsRequest(payload);

    yield put(getAlertsSuccess(alertsData));
  } catch (error) {
    yield handleError(error);
    yield put(getAlertsError());
  }
}

function* handleCheckAlertsToRefresh({ payload }: ReturnType<typeof checkAlertsToRefresh>) {
  try {
    const { total } = yield select(alertsReducerSelector);
    const alertsData: IGetAlertsResponseBody = yield handleGetAlertsRequest(payload);

    if (total !== alertsData.total && !document.hidden) {
      yield call(toast.info, <AlertsRefreshToast />);
    }
  } catch (error) {
    yield handleError(error);
    yield put(getAlertsError());
  }
}

function* handleDismissAlerts({ payload }: ReturnType<typeof dismissAlerts>) {
  try {
    yield put(mergeDismissDialog({ isLoading: true }));
    yield all(payload.map((id: number) => call(dismissAlertRequest, { id })));
    yield put(setDismissDialog());
    yield put(setSelectedAlerts([]));
    yield call(
      toast.success,
      `The Alert${payload.length > 1 ? 's' : ''} with id -
      ${payload.join(', ')} ${payload.length > 1 ? 'have' : 'has'} been successfully dismissed`,
    );
    yield handleRefreshAlerts();
  } catch (error) {
    yield handleError(error);
    yield put(mergeDismissDialog({ isLoading: false }));
  }
}

function* handleFlagAlerts({ payload }: ReturnType<typeof flagAlerts>) {
  try {
    yield all(payload.map((id: number) => call(flagAlertRequest, { id })));
    yield put(setSelectedAlerts([]));
    yield call(
      toast.success,
      `The Alert${payload.length > 1 ? 's' : ''} with id -
      ${payload.join(', ')} ${payload.length > 1 ? 'have' : 'has'} been successfully flagged`,
    );
    yield handleRefreshAlerts();
  } catch (error) {
    yield handleError(error);
  }
}

function* handleExportAlerts({ payload }: ReturnType<typeof exportAlerts>) {
  try {
    const { entities, ids }: IGetAlertsNormalizedData = yield handleGetAlertsRequest(payload);

    const preparedData = ids.map((id) => {
      const alert = entities[id];

      return ({
        Status: alertStatusLabelMap[alert.status],
        Flag: covertBooleanToYesNo(alert.isFlagged),
        'Alert ID': alert.id,
        'Alert Type': alert.type,
        Severity: alert.severity,
        Source: alert.source,
        'Date & Time': getDateTimeFormatted(alert.date),
        Description: alert.description,
      });
    });

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'alerts.csv');
    yield put(exportAlertsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportAlertsError());
  }
}

export function* alertsSagas() {
  yield all([
    yield takeLatest(
      getAlerts,
      handleGetAlerts,
    ),
    yield takeLatest(
      checkAlertsToRefresh,
      handleCheckAlertsToRefresh,
    ),
    yield takeLatest(
      dismissAlerts,
      handleDismissAlerts,
    ),
    yield takeLatest(
      flagAlerts,
      handleFlagAlerts,
    ),
    yield takeLatest(
      exportAlerts,
      handleExportAlerts,
    ),
  ]);
}

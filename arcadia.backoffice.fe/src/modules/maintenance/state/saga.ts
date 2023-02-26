import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { getDateTimeFormatted, saveStringAsFile } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import { IGetMaintenanceRequestFiltersParams, IGetMaintenanceResponseBody, MaintenanceAction } from '../types';
import {
  getMaintenance,
  getMaintenanceError,
  getMaintenanceSuccess,
  exportMaintenance,
  exportMaintenanceError,
  exportMaintenanceSuccess,
  executeMaintenanceAction,
  mergeMaintenanceDialogAction,
  setMaintenanceDialogAction,
} from './actions';
import {
  getMaintenanceRequest,
  maintenanceDismissRequest,
  maintenanceFillDispenserRequest,
  maintenanceWaistEmptiedRequest,
} from '../api';

function* handleRefreshList() {
  yield put(getMaintenance(queryString.parse(window.location.search)));
}

function* handleGetMaintenanceDataRequest(requestParams: IGetMaintenanceRequestFiltersParams) {
  const { data } = yield call(getMaintenanceRequest, requestParams);

  return data;
}

function* handleGetMaintenance({ payload }: ReturnType<typeof getMaintenance>) {
  try {
    const data: IGetMaintenanceResponseBody = yield handleGetMaintenanceDataRequest(payload);

    yield put(getMaintenanceSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getMaintenanceError());
  }
}

function* handleExportMaintenance({ payload }: ReturnType<typeof exportMaintenance>) {
  try {
    const { alerts }: IGetMaintenanceResponseBody = yield handleGetMaintenanceDataRequest(payload);

    const preparedData = alerts.map((alert) => ({
      'Alert ID': alert.id,
      'Alert Type': alert.type,
      Severity: alert.severity,
      Source: alert.source,
      'Date & Time': getDateTimeFormatted(alert.date),
      Description: alert.description,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'maintenance.csv');
    yield put(exportMaintenanceSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportMaintenanceError());
  }
}

function* handleExecuteMaintenanceAction({ payload }: ReturnType<typeof executeMaintenanceAction>) {
  try {
    const { id, action } = payload;

    yield put(mergeMaintenanceDialogAction({ isLoading: true }));

    switch (action) {
      case MaintenanceAction.fillDispenser:
        yield call(maintenanceFillDispenserRequest, id);
        yield call(toast.success, 'The dispenser has been successfully full-filled.');
        break;
      case MaintenanceAction.waistEmptied:
        yield call(maintenanceWaistEmptiedRequest, id);
        yield call(toast.success, 'Remove dispenser waist bin, empty, and replace');
        break;
      default:
        yield call(maintenanceDismissRequest, id);
        yield call(toast.success, `The Alert with id ${id} has been successfully dismissed.`);
        break;
    }

    yield put(setMaintenanceDialogAction());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMaintenanceDialogAction({ isLoading: false }));
  }
}

export function* maintenanceSagas() {
  yield all([
    yield takeLatest(
      getMaintenance,
      handleGetMaintenance,
    ),
    yield takeLatest(
      exportMaintenance,
      handleExportMaintenance,
    ),
    yield takeLatest(
      executeMaintenanceAction,
      handleExecuteMaintenanceAction,
    ),
  ]);
}

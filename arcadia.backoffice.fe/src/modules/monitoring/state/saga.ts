import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { saveStringAsFile, joinArrayBySymbol } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  IGetMonitoringRequestFilterParams,
  IGetMonitoringResponseBody,
  IMonitoringSegmentSubset,
  IOperator,
  IGroup,
  IMachine,
  SelectGroupIdPrefix,
  MonitoringAction,
} from '../types';
import {
  getMachinesRequest,
  getMonitoringRequest,
  removeMonitoringRequest,
  getGroupsRequest,
  getOperatorsRequest,
  postMonitoringRequest,
  putMonitoringRequest,
} from '../api';
import {
  getMonitoring,
  getMonitoringError,
  getMonitoringSuccess,
  exportMonitoring,
  exportMonitoringError,
  exportMonitoringSuccess,
  executeMonitoringAction,
  mergeMonitoringDialogAction,
  setMonitoringDialogAction,
  getSegmentSubset,
  mergeSegmentSubset,
  setSegmentSubset,
  postMonitoring,
  putMonitoring,
  mergeMonitoringDialogForm,
  setMonitoringDialogForm,
} from './actions';
import { monitoringStatusLabelMap } from '../constants';
import { addSelectGroupPrefix } from '../helpers';

function* handleRefreshList() {
  yield put(getMonitoring(queryString.parse(window.location.search)));
}

function* handleGetMonitoringRequest(requestParams: IGetMonitoringRequestFilterParams) {
  const { data } = yield call(getMonitoringRequest, requestParams);

  return data;
}

function* handlePostMonitoring({ payload }: ReturnType<typeof postMonitoring>) {
  try {
    yield put(mergeMonitoringDialogForm({
      isLoading: true,
    }));
    yield call(postMonitoringRequest, payload);
    yield call(toast.success, 'The Monitoring has been successfully added');
    yield put(setMonitoringDialogForm());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMonitoringDialogForm({
      isLoading: false,
    }));
  }
}

export function* handleGetMonitoring({ payload }: ReturnType<typeof getMonitoring>) {
  try {
    const MonitoringData: IGetMonitoringResponseBody = yield handleGetMonitoringRequest(payload);

    yield put(getMonitoringSuccess(MonitoringData));
  } catch (error) {
    yield handleError(error);
    yield put(getMonitoringError());
  }
}

function* handlePutMonitoring({ payload }: ReturnType<typeof putMonitoring>) {
  try {
    yield put(mergeMonitoringDialogForm({
      isLoading: true,
    }));
    yield call(putMonitoringRequest, payload);
    yield call(
      toast.success,
      `The Monitoring with id - ${payload.id} has been successfully changed`,
    );
    yield put(setMonitoringDialogForm());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMonitoringDialogForm({
      isLoading: false,
    }));
  }
}

export function* handleExecuteMonitoringAction({ payload }: ReturnType<typeof executeMonitoringAction>) {
  try {
    const { action, id, password } = payload;

    if (action === MonitoringAction.remove) {
      yield call(removeMonitoringRequest, { id, password });
      yield call(toast.success, `The monitoring with id ${id} has been successfully removed.`);
    }
    yield put(setMonitoringDialogAction());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMonitoringDialogAction({ isLoading: false }));
  }
}

function* handleExportMonitoring({ payload }: ReturnType<typeof exportMonitoring>) {
  try {
    const { monitoring }: IGetMonitoringResponseBody = yield handleGetMonitoringRequest(payload);

    const preparedData = monitoring.map((item) => ({
      Status: monitoringStatusLabelMap[item.status],
      Segment: item.segment,
      Mode: item.mode,
      Metric: item.metric,
      Dimension: item.dimension,
      'Target Value': item.targetValue,
      'Current Value': item.currentValue,
      'Alert Low Threshold': item.alertLowThreshold,
      'Alert High Threshold': item.alertHighThreshold,
      'Cutoff Low Threshold': item.cutoffLowThreshold,
      'Cutoff High Threshold': item.cutoffHighThreshold,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'monitoring.csv');
    yield put(exportMonitoringSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportMonitoringError());
  }
}

export function* handleGetSegmentSubset() {
  try {
    yield put(mergeSegmentSubset({ isLoading: true }));

    const options: IMonitoringSegmentSubset = {};

    const [machines, groups, operators] = yield all([
      yield call(getMachinesRequest),
      yield call(getGroupsRequest),
      yield call(getOperatorsRequest),
    ]);

    options.operators = operators.map(({ name, id }: IOperator) => ({
      value: addSelectGroupPrefix(id, SelectGroupIdPrefix.operator),
      label: name,
    }));
    options.machines = machines.map(({ name, id }: IMachine) => ({
      value: addSelectGroupPrefix(id, SelectGroupIdPrefix.machine),
      label: name,
    }));
    options.groups = groups.map(({ name, id }: IGroup) => ({
      value: addSelectGroupPrefix(id, SelectGroupIdPrefix.group),
      label: name,
    }));

    yield put(setSegmentSubset(options));
  } catch (error) {
    yield handleError(error);
    yield put(mergeSegmentSubset({ isLoading: false }));
  }
}

export function* monitoringSagas() {
  yield all([
    yield takeLatest(
      postMonitoring,
      handlePostMonitoring,
    ),
    yield takeLatest(
      getMonitoring,
      handleGetMonitoring,
    ),
    yield takeLatest(
      putMonitoring,
      handlePutMonitoring,
    ),
    yield takeLatest(
      executeMonitoringAction,
      handleExecuteMonitoringAction,
    ),
    yield takeLatest(
      exportMonitoring,
      handleExportMonitoring,
    ),
    yield takeLatest(
      getSegmentSubset,
      handleGetSegmentSubset,
    ),
  ]);
}

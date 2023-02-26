import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { saveStringAsFile } from 'arcadia-common-fe';
import { getHistoryRequest } from '../api';
import {
  exportHistory,
  exportHistoryError,
  getHistoryData,
  getHistoryDataError,
  getHistoryDataSuccess,
  exportHistorySuccess,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import { IGetHistoryRequestBody, IGetHistoryResponseBody } from '../types';

function* handleGetHistoryRequest(payload: IGetHistoryRequestBody) {
  const { data } = yield call(getHistoryRequest, payload);

  return data;
}

export function* handleGetHistoryData({ payload }: ReturnType<typeof getHistoryData>) {
  try {
    const data = yield handleGetHistoryRequest(payload);

    yield put(getHistoryDataSuccess(data));
  } catch (error) {
    yield put(getHistoryDataError());
    yield handleError(error);
  }
}

function* handleExportHistory({ payload }: ReturnType<typeof exportHistory>) {
  try {
    const { historyType } = payload;
    const { history }: IGetHistoryResponseBody = yield handleGetHistoryRequest(payload);

    const preparedData = history.map((item) => ({
      Date: item.date,
      Action: item.action,
      'User ID': item.user.id,
      'User Email': item.user.email,
      'User Name': item.user.name,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, `${historyType}-history.csv`);
    yield put(exportHistorySuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportHistoryError());
  }
}

export function* historySagas() {
  yield all([
    yield takeEvery(
      getHistoryData,
      handleGetHistoryData,
    ),
    yield takeLatest(
      exportHistory,
      handleExportHistory,
    ),
  ]);
}

import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import {
  getProcessedReports,
  getProcessedReportsSuccess,
  getProcessedReportsError,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getProcessedReportsRequest } from '../api';

function* handleGetProcessedReports({ payload }: ReturnType<typeof getProcessedReports>) {
  try {
    const { data } = yield call(getProcessedReportsRequest, payload);

    yield put(getProcessedReportsSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getProcessedReportsError());
  }
}

export function* processedReportsSagas() {
  yield all([
    yield takeLatest(
      getProcessedReports,
      handleGetProcessedReports,
    ),
  ]);
}

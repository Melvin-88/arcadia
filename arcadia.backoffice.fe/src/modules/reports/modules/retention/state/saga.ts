import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getRetentionReport,
  getRetentionReportSuccess,
  getRetentionReportError,
  exportRetentionReport,
  exportRetentionReportError,
  exportRetentionReportSuccess,
  clearRetentionReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getRetentionReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IRetentionReportItem, IGetRetentionReportResponseBody } from '../types';

function* handleGetRetentionReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getRetentionReportRequest, requestParams);

  return data;
}

function* handleGetRetentionReport({ payload }: ReturnType<typeof getRetentionReport>) {
  try {
    const retentionReportData: IGetRetentionReportResponseBody = yield handleGetRetentionReportRequest(payload);
    const { info } = retentionReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearRetentionReport());
    } else {
      yield put(getRetentionReportSuccess(retentionReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getRetentionReportError());
  }
}

function* handleExportRetentionReport({ payload }: ReturnType<typeof exportRetentionReport>) {
  try {
    const { data }: IGetRetentionReportResponseBody = yield handleGetRetentionReportRequest(payload);

    const preparedData = data.map((retentionReport: IRetentionReportItem) => ({
      'Grouping value': retentionReport.grouping_value,
      R1: retentionReport.r1,
      R2: retentionReport.r2,
      R7: retentionReport.r7,
      R14: retentionReport.r14,
      R30: retentionReport.r30,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Retention report.csv');
    yield put(exportRetentionReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportRetentionReportError());
  }
}

export function* retentionReportSagas() {
  yield all([
    yield takeLatest(
      getRetentionReport,
      handleGetRetentionReport,
    ),
    yield takeLatest(
      exportRetentionReport,
      handleExportRetentionReport,
    ),
  ]);
}

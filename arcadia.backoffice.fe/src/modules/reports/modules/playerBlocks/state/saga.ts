import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getPlayerBlocksReport,
  getPlayerBlocksReportSuccess,
  getPlayerBlocksReportError,
  exportPlayerBlocksReport,
  exportPlayerBlocksReportError,
  exportPlayerBlocksReportSuccess,
  clearPlayerBlocksReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getPlayerBlocksReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IPlayerBlocksReportItem, IGetPlayerBlocksReportResponseBody } from '../types';

function* handleGetPlayerBlocksReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getPlayerBlocksReportRequest, requestParams);

  return data;
}

function* handleGetPlayerBlocksReport({ payload }: ReturnType<typeof getPlayerBlocksReport>) {
  try {
    const playerBlocksReportData: IGetPlayerBlocksReportResponseBody = yield handleGetPlayerBlocksReportRequest(payload);
    const { info } = playerBlocksReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearPlayerBlocksReport());
    } else {
      yield put(getPlayerBlocksReportSuccess(playerBlocksReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getPlayerBlocksReportError());
  }
}

function* handleExportPlayerBlocksReport({ payload }: ReturnType<typeof exportPlayerBlocksReport>) {
  try {
    const { data }: IGetPlayerBlocksReportResponseBody = yield handleGetPlayerBlocksReportRequest(payload);

    const preparedData = data.map((item: IPlayerBlocksReportItem) => ({
      'Grouping value': item.grouping_value,
      Blocked: item.total_blocked,
      Unblocked: item.total_unblocked,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Player blocks report.csv');
    yield put(exportPlayerBlocksReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportPlayerBlocksReportError());
  }
}

export function* playerBlocksReportSagas() {
  yield all([
    yield takeLatest(
      getPlayerBlocksReport,
      handleGetPlayerBlocksReport,
    ),
    yield takeLatest(
      exportPlayerBlocksReport,
      handleExportPlayerBlocksReport,
    ),
  ]);
}

import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getVouchersReport,
  getVouchersReportSuccess,
  getVouchersReportError,
  exportVouchersReport,
  exportVouchersReportError,
  exportVouchersReportSuccess,
  clearVouchersReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getVouchersReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IVouchersReportItem, IGetVouchersReportResponseBody } from '../types';

function* handleGetVouchersReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getVouchersReportRequest, requestParams);

  return data;
}

function* handleGetVouchersReport({ payload }: ReturnType<typeof getVouchersReport>) {
  try {
    const vouchersReportData: IGetVouchersReportResponseBody = yield handleGetVouchersReportRequest(payload);
    const { info } = vouchersReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearVouchersReport());
    } else {
      yield put(getVouchersReportSuccess(vouchersReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getVouchersReportError());
  }
}

function* handleExportVouchersReport({ payload }: ReturnType<typeof exportVouchersReport>) {
  try {
    const { data }: IGetVouchersReportResponseBody = yield handleGetVouchersReportRequest(payload);

    const preparedData = data.map((item: IVouchersReportItem) => ({
      'Grouping value': item.grouping_value,
      'Vouchers issued': item.total_vouchers_issued,
      'Vouchers used': item.total_vouchers_used,
      'Vouchers bets': item.total_vouchers_bets,
      'Vouchers wins': item.total_vouchers_wins,
      'Vouchers expired': item.total_vouchers_expired,
      'Vouchers cancelled': item.total_vouchers_canceled,
      'Rounds played': item.total_rounds_played,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Vouchers report.csv');
    yield put(exportVouchersReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportVouchersReportError());
  }
}

export function* vouchersReportSagas() {
  yield all([
    yield takeLatest(
      getVouchersReport,
      handleGetVouchersReport,
    ),
    yield takeLatest(
      exportVouchersReport,
      handleExportVouchersReport,
    ),
  ]);
}

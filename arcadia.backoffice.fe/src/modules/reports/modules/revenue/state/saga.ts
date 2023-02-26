import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getRevenueReport,
  getRevenueReportSuccess,
  getRevenueReportError,
  exportRevenueReport,
  exportRevenueReportError,
  exportRevenueReportSuccess,
  clearRevenueReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getRevenueReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IRevenueReportItem, IGetRevenueReportResponseBody } from '../types';

function* handleGetRevenueReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getRevenueReportRequest, requestParams);

  return data;
}

function* handleGetRevenueReport({ payload }: ReturnType<typeof getRevenueReport>) {
  try {
    const revenueReportData: IGetRevenueReportResponseBody = yield handleGetRevenueReportRequest(payload);
    const { info } = revenueReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearRevenueReport());
    } else {
      yield put(getRevenueReportSuccess(revenueReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getRevenueReportError());
  }
}

function* handleExportRevenueReport({ payload }: ReturnType<typeof exportRevenueReport>) {
  try {
    const { data }: IGetRevenueReportResponseBody = yield handleGetRevenueReportRequest(payload);

    const preparedData = data.map((item: IRevenueReportItem) => ({
      'Grouping value': item.grouping_value,
      Players: item.total_unique_players,
      'New players': item.total_new_players,
      Bets: item.total_bets,
      Wins: item.total_wins,
      'Voucher bets': item.total_voucher_bets,
      'Voucher wins': item.total_voucher_wins,
      Refunds: item.total_refunds,
      'Gross gaming': item.total_gross_gaming,
      'Net gaming': item.total_net_gaming,
      ARPU: item.arpu,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Revenue report.csv');
    yield put(exportRevenueReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportRevenueReportError());
  }
}

export function* revenueReportSagas() {
  yield all([
    yield takeLatest(
      getRevenueReport,
      handleGetRevenueReport,
    ),
    yield takeLatest(
      exportRevenueReport,
      handleExportRevenueReport,
    ),
  ]);
}

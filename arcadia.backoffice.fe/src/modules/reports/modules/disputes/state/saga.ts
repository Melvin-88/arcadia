import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getDisputesReport,
  getDisputesReportSuccess,
  getDisputesReportError,
  exportDisputesReport,
  exportDisputesReportError,
  exportDisputesReportSuccess,
  clearDisputesReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getDisputesReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IDisputesReportItem, IGetDisputesReportResponseBody } from '../types';

function* handleGetDisputesReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getDisputesReportRequest, requestParams);

  return data;
}

function* handleGetDisputesReport({ payload }: ReturnType<typeof getDisputesReport>) {
  try {
    const disputesReportData: IGetDisputesReportResponseBody = yield handleGetDisputesReportRequest(payload);
    const { info } = disputesReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearDisputesReport());
    } else {
      yield put(getDisputesReportSuccess(disputesReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getDisputesReportError());
  }
}

function* handleExportDisputesReport({ payload }: ReturnType<typeof exportDisputesReport>) {
  try {
    const { data }: IGetDisputesReportResponseBody = yield handleGetDisputesReportRequest(payload);

    const preparedData = data.map((item: IDisputesReportItem) => ({
      'Grouping value': item.grouping_value,
      'Total dispute count': item.total_dispute_count,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Disputes report.csv');
    yield put(exportDisputesReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportDisputesReportError());
  }
}

export function* disputesReportSagas() {
  yield all([
    yield takeLatest(
      getDisputesReport,
      handleGetDisputesReport,
    ),
    yield takeLatest(
      exportDisputesReport,
      handleExportDisputesReport,
    ),
  ]);
}

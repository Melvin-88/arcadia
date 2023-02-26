import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { getDateTimeFormatted, saveStringAsFile, formatCurrency } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  exportDisputes,
  exportDisputesError,
  exportDisputesSuccess,
  getDisputes,
  getDisputesError,
  getDisputesSuccess,
  mergeDisputeDialogForm,
  postDispute,
  putDispute,
  setDisputeDialogForm,
} from './actions';
import { getDisputesRequest, postDisputeRequest, putDisputeRequest } from '../api';
import { IGetDisputesRequestFiltersParams, IGetDisputesResponseBody } from '../types';
import { disputeStatusLabelMap } from '../constants';

function* handleGetDisputesRequest(requestParams: IGetDisputesRequestFiltersParams) {
  const { data } = yield call(getDisputesRequest, requestParams);

  return data;
}

function* handleRefreshDisputes() {
  yield put(getDisputes(queryString.parse(window.location.search)));
}

function* handlePostDispute({ payload }: ReturnType<typeof postDispute>) {
  try {
    yield put(mergeDisputeDialogForm({
      isLoading: true,
    }));
    yield call(postDisputeRequest, payload);
    yield call(toast.success, 'The Dispute has been successfully added');
    yield put(setDisputeDialogForm({}));
    yield handleRefreshDisputes();
  } catch (error) {
    yield handleError(error);
    yield put(mergeDisputeDialogForm({
      isLoading: false,
    }));
  }
}

function* handleGetDisputes({ payload }: ReturnType<typeof getDisputes>) {
  try {
    const disputesData: IGetDisputesResponseBody = yield handleGetDisputesRequest(payload);

    yield put(getDisputesSuccess(disputesData));
  } catch (error) {
    yield handleError(error);
    yield put(getDisputesError());
  }
}

function* handlePutDispute({ payload }: ReturnType<typeof putDispute>) {
  try {
    yield put(mergeDisputeDialogForm({
      isLoading: true,
    }));
    yield call(putDisputeRequest, payload);
    yield call(
      toast.success,
      `The Dispute with id - ${payload.id} has been successfully changed`,
    );
    yield put(setDisputeDialogForm({}));
    yield handleRefreshDisputes();
  } catch (error) {
    yield handleError(error);
    yield put(mergeDisputeDialogForm({
      isLoading: false,
    }));
  }
}

function* handleExportDisputes({ payload }: ReturnType<typeof exportDisputes>) {
  try {
    const { disputes }: IGetDisputesResponseBody = yield handleGetDisputesRequest(payload);

    const preparedData = disputes.map((dispute) => ({
      Status: disputeStatusLabelMap[dispute.status],
      'Dispute ID': dispute.id,
      'Operator Name': dispute.operatorName,
      'Player CID': dispute.playerCid,
      'Session ID': dispute.sessionId,
      Rebate: formatCurrency(dispute.rebateSum, dispute.rebateCurrency),
      'Opened Date & Time': getDateTimeFormatted(dispute.openedAtDate),
      'Closed Date & Time': getDateTimeFormatted(dispute.closedDate),
      Complaint: dispute.complaint,
      Discussion: dispute.discussion,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'disputes.csv');
    yield put(exportDisputesSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportDisputesError());
  }
}

export function* disputesSagas() {
  yield all([
    yield takeLatest(
      postDispute,
      handlePostDispute,
    ),
    yield takeLatest(
      getDisputes,
      handleGetDisputes,
    ),
    yield takeLatest(
      putDispute,
      handlePutDispute,
    ),
    yield takeLatest(
      exportDisputes,
      handleExportDisputes,
    ),
  ]);
}

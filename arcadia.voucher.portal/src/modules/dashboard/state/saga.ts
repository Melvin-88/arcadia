import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import {
  getDateTimeFormatted,
  voucherStatusLabelMap,
  saveStringAsFile,
  IGetVouchersRequestFiltersParams,
  IGetVouchersResponseBody,
} from 'arcadia-common-fe';
import { toast } from 'react-toastify';
import {
  getStatistics,
  getStatisticsSuccess,
  getStatisticsError,
  getVouchers,
  getVouchersError,
  getVouchersSuccess,
  exportVouchers,
  exportVouchersSuccess,
  exportVouchersError,
  postVoucher,
  mergeVoucherDialogForm,
  setVoucherDialogForm,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import { getStatisticsRequest, getVouchersRequest, postVoucherRequest } from '../api';

function* handleGetVouchersRequest(requestParams: IGetVouchersRequestFiltersParams) {
  const { data } = yield call(getVouchersRequest, requestParams);

  return data;
}

function* handleRefreshVouchers() {
  yield put(getVouchers(queryString.parse(window.location.search)));
}

function* handlePostVoucher({ payload }: ReturnType<typeof postVoucher>) {
  try {
    yield put(mergeVoucherDialogForm({
      isLoading: true,
    }));
    yield call(postVoucherRequest, payload);
    yield put(setVoucherDialogForm());
    yield call(toast.success, 'The voucher has been successfully created');
    yield handleRefreshVouchers();
  } catch (error) {
    yield handleError(error);
    yield put(mergeVoucherDialogForm({
      isLoading: false,
    }));
  }
}

export function* handleGetStatistics() {
  try {
    const { data } = yield getStatisticsRequest();

    yield put(getStatisticsSuccess(data));
  } catch (error) {
    yield handleError(error);
    yield put(getStatisticsError());
  }
}

export function* handleGetVouchers({ payload }: ReturnType<typeof getVouchers>) {
  try {
    const vouchersData: IGetVouchersResponseBody = yield handleGetVouchersRequest(payload);

    yield put(getVouchersSuccess(vouchersData));
  } catch (error) {
    yield handleError(error);
    yield put(getVouchersError());
  }
}

function* handleExportVouchers({ payload }: ReturnType<typeof exportVouchers>) {
  try {
    const { vouchers }: IGetVouchersResponseBody = yield handleGetVouchersRequest(payload);

    const preparedData = vouchers.map((voucher) => ({
      Status: voucherStatusLabelMap[voucher.status],
      'Voucher ID': voucher.id,
      'Operator Name': voucher.operatorName,
      'Player CID': voucher.playerCid,
      'Group Name': voucher.groupName,
      'Granted Date': getDateTimeFormatted(voucher.grantedDate),
      'Expiration Date': getDateTimeFormatted(voucher.expirationDate),
      Reason: voucher.revocationReason,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'vouchers.csv');
    yield put(exportVouchersSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportVouchersError());
  }
}

export function* dashboardSagas() {
  yield all([
    yield takeLatest(
      postVoucher,
      handlePostVoucher,
    ),
    yield takeLatest(
      getStatistics,
      handleGetStatistics,
    ),
    yield takeLatest(
      getVouchers,
      handleGetVouchers,
    ),
    yield takeLatest(
      exportVouchers,
      handleExportVouchers,
    ),
  ]);
}

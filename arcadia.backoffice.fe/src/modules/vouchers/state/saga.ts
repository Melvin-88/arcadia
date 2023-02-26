import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import {
  voucherStatusLabelMap,
  getDateTimeFormatted,
  saveStringAsFile,
  IGetVouchersRequestFiltersParams,
  IGetVouchersResponseBody,
  VoucherID,
  IVouchers,
  IVouchersNormalizedData,
} from 'arcadia-common-fe';
import { normalize, schema } from 'normalizr';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  getVouchers,
  getVouchersError,
  getVouchersSuccess,
  exportVouchers,
  exportVouchersError,
  exportVouchersSuccess,
  vouchersRevoke,
  mergeVouchersRevokeDialog,
  setVouchersRevokeDialog,
} from './actions';
import { getVouchersRequest, voucherRevokeRequest } from '../api';

const vouchersSchema = new schema.Entity('vouchers');
const vouchersListSchema = new schema.Array(vouchersSchema);

function* handleGetVouchersDataRequest(requestParams: IGetVouchersRequestFiltersParams) {
  const { data } = yield call(getVouchersRequest, requestParams);
  const { result: vouchersIds, entities } = normalize<IVouchers>(data.vouchers, vouchersListSchema);

  return {
    ids: vouchersIds,
    entities: entities.vouchers,
    total: data.total,
  };
}

function* handleRefreshVouchers() {
  yield put(getVouchers(queryString.parse(window.location.search)));
}

function* handleGetVouchers({ payload }: ReturnType<typeof getVouchers>) {
  try {
    const vouchersData: IVouchersNormalizedData = yield handleGetVouchersDataRequest(payload);

    yield put(getVouchersSuccess(vouchersData));
  } catch (error) {
    yield handleError(error);
    yield put(getVouchersError());
  }
}

function* handleVouchersRevoke({ payload }: ReturnType<typeof vouchersRevoke>) {
  try {
    yield put(mergeVouchersRevokeDialog({ isLoading: true }));

    const { ids, reason, password } = payload;

    yield all(ids.map((id: VoucherID) => call(voucherRevokeRequest, { reason, id, password })));
    yield call(
      toast.success,
      `The Voucher${ids.length > 1 ? 's' : ''} with id -
      ${ids.join(', ')} ${ids.length > 1 ? 'have' : 'has'} been successfully revoke`,
    );
    yield put(setVouchersRevokeDialog());
    yield handleRefreshVouchers();
  } catch (error) {
    yield put(mergeVouchersRevokeDialog({ isLoading: false }));
    yield handleError(error);
  }
}

function* handleExportVouchers({ payload }: ReturnType<typeof exportVouchers>) {
  try {
    const { vouchers }: IGetVouchersResponseBody = yield handleGetVouchersDataRequest(payload);

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

export function* vouchersSagas() {
  yield all([
    yield takeLatest(
      getVouchers,
      handleGetVouchers,
    ),
    yield takeLatest(
      vouchersRevoke,
      handleVouchersRevoke,
    ),
    yield takeLatest(
      exportVouchers,
      handleExportVouchers,
    ),
  ]);
}

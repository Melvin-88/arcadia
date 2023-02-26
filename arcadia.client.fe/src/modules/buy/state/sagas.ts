import {
  all, call, takeLatest,
} from 'redux-saga/effects';
import { PubSubClient } from '../../../services/pubSubClient/client';
import { getVoucher } from './actions';
import { handleError } from '../../../services/sagasErrorHandler';

const pubSubClient = PubSubClient.getInstance();

function* handleGetVoucher() {
  try {
    yield call(pubSubClient.getVoucher);
  } catch (error) {
    yield handleError(error);
  }
}

export function* buySagas() {
  yield all([
    yield takeLatest(
      getVoucher,
      handleGetVoucher,
    ),
  ]);
}

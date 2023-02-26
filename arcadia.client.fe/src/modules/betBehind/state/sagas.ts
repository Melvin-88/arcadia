import {
  all, call, select, takeLatest,
} from 'redux-saga/effects';
import {
  disableBetBehind,
  enableBetBehind,
  mergeBetBehindConfig,
  setBetBehindConfig,
} from './actions';
import { SessionStorageKeys } from '../../../constants';
import { betBehindSelector } from './selectors';
import { handleError } from '../../../services/sagasErrorHandler';
import { PubSubClient } from '../../../services/pubSubClient/client';

const pubSubClient = PubSubClient.getInstance();

function* handleBetBehindConfigChange() {
  try {
    const { config } = yield select(betBehindSelector);

    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.betBehindConfig, JSON.stringify(config));
  } catch (error) {
    yield handleError(error);
  }
}

function* handleBetBehindEnable({ payload }: ReturnType<typeof enableBetBehind>) {
  try {
    yield call(pubSubClient.enableBetBehind, payload.config);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleBetBehindDisable() {
  try {
    yield call(pubSubClient.disableBetBehind);
  } catch (error) {
    yield handleError(error);
  }
}

export function* betBehindSagas() {
  yield all([
    yield takeLatest(
      setBetBehindConfig,
      handleBetBehindConfigChange,
    ),
    yield takeLatest(
      mergeBetBehindConfig,
      handleBetBehindConfigChange,
    ),
    yield takeLatest(
      enableBetBehind,
      handleBetBehindEnable,
    ),
    yield takeLatest(
      disableBetBehind,
      handleBetBehindDisable,
    ),
  ]);
}

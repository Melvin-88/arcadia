import {
  all, call, select, takeLatest,
} from 'redux-saga/effects';
import {
  mergeAutoplayConfig, setAutoplayConfig, setAutoSwingMode,
} from './actions';
import { SessionStorageKeys } from '../../../constants';
import { autoplaySelector } from './selectors';
import { handleError } from '../../../services/sagasErrorHandler';
import { PubSubClient } from '../../../services/pubSubClient/client';

const pubSubClient = PubSubClient.getInstance();

function* handleAutoplayConfigChange() {
  try {
    const { config } = yield select(autoplaySelector);

    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.autoplayConfig, JSON.stringify(config));
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetAutoSwingMode({ payload }: ReturnType<typeof setAutoSwingMode>) {
  try {
    yield call(pubSubClient.setSwingMode, payload.mode);
    yield handleAutoplayConfigChange();
  } catch (error) {
    yield handleError(error);
  }
}

export function* autoplaySagas() {
  yield all([
    yield takeLatest(
      setAutoplayConfig,
      handleAutoplayConfigChange,
    ),
    yield takeLatest(
      mergeAutoplayConfig,
      handleAutoplayConfigChange,
    ),
    yield takeLatest(
      setAutoSwingMode,
      handleSetAutoSwingMode,
    ),
  ]);
}

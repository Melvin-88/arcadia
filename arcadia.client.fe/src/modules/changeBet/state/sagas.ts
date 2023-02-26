import {
  all, call, takeLatest,
} from 'redux-saga/effects';
import { PubSubClient } from '../../../services/pubSubClient/client';
import { getGroups } from './actions';
import { handleError } from '../../../services/sagasErrorHandler';

const pubSubClient = PubSubClient.getInstance();

function* handleGetGroups() {
  try {
    yield call(pubSubClient.getGroups);
  } catch (error) {
    yield handleError(error);
  }
}

export function* changeBetSagas() {
  yield all([
    yield takeLatest(
      getGroups,
      handleGetGroups,
    ),
  ]);
}

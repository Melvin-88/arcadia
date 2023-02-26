import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import i18next from 'i18next';
import { handleError } from '../../../services/sagasErrorHandler';
import { goToTheOperatorLobby } from '../../app/actions';
import { getLobbyData, getLobbyDataError, getLobbyDataSuccess } from './actions';
import { getLobbyDataRequest } from '../api';

function* handleGetLobbyData({ payload }: ReturnType<typeof getLobbyData>) {
  try {
    const { data } = yield call(getLobbyDataRequest, payload);

    yield put(getLobbyDataSuccess(data));
  } catch (error) {
    switch (error.response?.status) {
      case 401:
        error.message = i18next.t('UserEvents.LoginError.AuthFailedException');
        break;
      case 406:
        error.message = i18next.t('UserEvents.LoginError.OperatorUnexpectedStateException');
        break;
      default:
    }

    yield handleError(error);
    yield put(goToTheOperatorLobby());
    yield put(getLobbyDataError());
  }
}

export function* lobbySagas() {
  yield all([
    yield takeLatest(
      getLobbyData,
      handleGetLobbyData,
    ),
  ]);
}

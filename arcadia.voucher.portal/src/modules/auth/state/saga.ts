import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import { history } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import { DEFAULT_ROUTE, ROUTES_MAP } from '../../../routing/constants';
import {
  signIn,
  signInError,
  signInSuccess,
  logOut,
} from './actions';
import { signInRequest } from '../api';
import { LocalStorageKeys } from '../../../constants';

export function* handleSignIn({ payload }: ReturnType<typeof signIn>) {
  try {
    const { data } = yield call(signInRequest, payload);

    yield call([localStorage, 'setItem'], LocalStorageKeys.accessToken, data.token);
    yield call([localStorage, 'setItem'], LocalStorageKeys.operator, JSON.stringify(data.operator));
    yield put(signInSuccess(data));
    history.push(DEFAULT_ROUTE.path);
  } catch (error) {
    yield handleError(error);
    yield put(signInError());
  }
}

export function* handleLogOut() {
  try {
    yield call([localStorage, 'removeItem'], LocalStorageKeys.accessToken);
    yield call([localStorage, 'removeItem'], LocalStorageKeys.operator);
    history.push(ROUTES_MAP.signIn.path);
  } catch (error) {
    yield handleError(error);
  }
}

export function* authSagas() {
  yield all([
    yield takeLatest(
      signIn,
      handleSignIn,
    ),
    yield takeLatest(
      logOut,
      handleLogOut,
    ),
  ]);
}

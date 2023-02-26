import {
  all, call, put, takeLatest, select,
} from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { history } from 'arcadia-common-fe';
import { handleError } from '../../services/sagasErrorHandler';
import { DEFAULT_ROUTE, IRoutesMap, ROUTES_MAP } from '../../routing/constants';
import {
  signIn,
  signInError,
  signInSuccess,
  getPermissions,
  getPermissionsSuccess,
  getPermissionsError,
  logOut,
} from './actions';
import {
  signInRequest, getUserPermissionsRequest, getPermissionsRequest,
} from './api';
import { LocalStorageKeys } from '../../constants';
import { IPermission, IPermissionsEntities } from './types';
import { authReducerSelector } from './selectors';

const permissionSchema = new schema.Entity('permissions');
const permissionsListSchema = new schema.Array(permissionSchema);

export function* handlePushUserToDefaultRoute() {
  try {
    const { userPermissions } = yield select(authReducerSelector);
    const defaultRoute = Object.values(ROUTES_MAP).find(
      (route: IRoutesMap) => route.permissionId && Number(route.permissionId) === userPermissions[0],
    );

    history.push((defaultRoute && defaultRoute.path) || DEFAULT_ROUTE.path);
  } catch (error) {
    yield handleError(error);
  }
}

export function* handleGetPermissions() {
  try {
    const [{ data }, userPermissions] = yield all([
      yield call(getPermissionsRequest),
      yield call(getUserPermissionsRequest),
    ]);
    const { result: permissionsIds, entities } = normalize<IPermission>(data.modules, permissionsListSchema);

    yield put(getPermissionsSuccess({
      permissionsIds,
      permissionsEntities: entities.permissions as IPermissionsEntities,
      userPermissions: userPermissions.data,
    }));
  } catch (error) {
    yield handleError(error);
    yield put(getPermissionsError());
  }
}

export function* handleSignIn({ payload }: ReturnType<typeof signIn>) {
  try {
    const { data } = yield call(signInRequest, payload);

    yield call([localStorage, 'setItem'], LocalStorageKeys.accessToken, data.token);
    yield call([localStorage, 'setItem'], LocalStorageKeys.user, JSON.stringify(data.user));
    yield put(signInSuccess(data));
    yield handleGetPermissions();
    yield handlePushUserToDefaultRoute();
  } catch (error) {
    yield handleError(error);
    yield put(signInError());
  }
}

export function* handleLogOut() {
  try {
    yield call([localStorage, 'removeItem'], LocalStorageKeys.accessToken);
    yield call([localStorage, 'removeItem'], LocalStorageKeys.user);
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
    yield takeLatest(
      getPermissions,
      handleGetPermissions,
    ),
  ]);
}

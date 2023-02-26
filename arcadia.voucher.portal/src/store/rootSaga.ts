import { all } from 'redux-saga/effects';
import { authSagas } from '../modules/auth/state/saga';
import { selectEntityByTypeSagas } from '../modules/selectEntityByType/saga';
import { dashboardSagas } from '../modules/dashboard/state/saga';

export function* rootSaga() {
  yield all([
    authSagas(),
    selectEntityByTypeSagas(),
    dashboardSagas(),
  ]);
}

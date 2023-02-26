import { all } from 'redux-saga/effects';
import { appSagas } from '../modules/app/sagas';
import { lobbySagas } from '../modules/lobby/state/saga';
import { gameSagas } from '../modules/game/state/sagas';
// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { authSagas } from '../modules/auth/state/sagas';
import { pubSubSagas } from '../services/pubSubClient/sagas';
import { buySagas } from '../modules/buy/state/sagas';
import { autoplaySagas } from '../modules/autoplay/state/sagas';
import { betBehindSagas } from '../modules/betBehind/state/sagas';
import { changeBetSagas } from '../modules/changeBet/state/sagas';
// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { jackpotSagas } from '../modules/jackpot/state/sagas';
import { queueSagas } from '../modules/queue/sagas';

export function* rootSaga() {
  yield all([
    appSagas(),
    lobbySagas(),
    authSagas(),
    gameSagas(),
    pubSubSagas(),
    buySagas(),
    autoplaySagas(),
    betBehindSagas(),
    changeBetSagas(),
    jackpotSagas(),
    queueSagas(),
  ]);
}

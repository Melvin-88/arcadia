import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import i18next from 'i18next';
import { signInRequest } from '../api';
import { goToTheOperatorLobby, setAppLoader, setHomeUrl } from '../../app/actions';
import { handleError } from '../../../services/sagasErrorHandler';
import { signIn } from './actions';
import { SessionStorageKeys } from '../../../constants';
import { history } from '../../../routing/history';
import { ROUTES_MAP } from '../../../routing/constants';
import { setupJackpot } from '../../jackpot/state/actions';

function* handleSignIn({ payload }: ReturnType<typeof signIn>) {
  try {
    yield put(setAppLoader({
      isLoading: true,
      message: i18next.t('Auth.Verification'),
    }));

    const { homeUrl = '', ...restPayload } = payload;

    const { data } = yield call(signInRequest, restPayload);
    const {
      token, url, playerId, currency, blueRibbonBaseServiceUrl, blueRibbonToken, blueRibbonOperatorId,
    } = data;

    yield call([sessionStorage, sessionStorage.clear]);
    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.accessToken, token);
    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.socketURL, url);
    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.playerId, playerId);
    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.blueRibbonAccessToken, blueRibbonToken);
    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.homeUrl, homeUrl);

    yield put(setupJackpot({
      baseServiceUrl: blueRibbonBaseServiceUrl,
      operatorId: blueRibbonOperatorId,
      playerId,
      currency,
    }));

    yield put(setHomeUrl({ homeUrl }));

    history.push(ROUTES_MAP.lobby.path);
  } catch (error) {
    yield put(goToTheOperatorLobby());
    yield handleError(error);
  } finally {
    yield put(setAppLoader());
  }
}

export function* authSagas() {
  yield all([
    yield takeLatest(
      signIn,
      handleSignIn,
    ),
  ]);
}

import {
  all, call, delay, fork, put, select, take, takeEvery, takeLatest,
} from 'redux-saga/effects';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import { isAllOf } from '@reduxjs/toolkit';
import {
  changeOrientation,
  forceGoToLobby,
  goToTheOperatorLobby,
  initUserInMachine,
  mergeSoundsConfig,
  notification,
  quit,
  restoreConnection,
  setAppLoader,
  setIsLostConnection,
  setResult,
  setSession,
  setSessionStatus,
} from './actions';
import { SoundsController } from '../../services/sounds/controller';
import { BackgroundSound, GameEventSound, SoundEffect } from '../../services/sounds/types';
import { history } from '../../routing/history';
import { ROUTES_MAP } from '../../routing/constants';
import { SessionStorageKeys } from '../../constants';
import { handleError } from '../../services/sagasErrorHandler';
import { PubSubClient } from '../../services/pubSubClient/client';
import { PubSubUserEventNotification } from '../../services/pubSubClient/constants';
import { resultDialogSelector, sessionSelector, soundsConfigSelector } from './selectors';
import {
  pubSubConnectAndLoginSuccess,
  pubSubRestoreConnection,
} from '../../services/pubSubClient/actions';
import { IChangeOrientationData, ISoundsConfig } from './types';
import { NotificationType } from '../../types/notification';
import {
  getOrGenerateFootprint,
  isAutoplaySessionStatus,
  isPassiveSessionStatus,
  isPlayingSessionStatus,
} from '../../services/general';
import { setIdleTimeoutStartTimestamp } from '../game/state/actions';
import { autoplaySelector } from '../autoplay/state/selectors';
import { mergeOverlay } from '../overlay/state/actions';

const TOAST_AUTO_HIDE_DURATION = 2000;
const NETWORK_STATUS_CHECK_INTERVAL = 1000;
const soundsController = SoundsController.getInstance();
const pubSubClient = PubSubClient.getInstance();

function* handlePubSubConnectSuccess() {
  try {
    history.push(ROUTES_MAP.game.path);
  } catch (error) {
    yield handleError(error, i18next.t('SystemEvents.PubSubConnect.DefaultError'));
  }
}

function* handleChangeSoundsConfig() {
  try {
    const soundsConfig: ISoundsConfig = yield select(soundsConfigSelector);
    const { isAllSoundsMuted, isGameSoundsMuted, gameSoundsVolume } = soundsConfig;

    // TODO: We need to check where it was updated by the user and then send notification
    yield call(pubSubClient.sendUserEventNotification, { type: PubSubUserEventNotification.settingsUpdate, data: soundsConfig });

    yield call(soundsController.setVolume, isAllSoundsMuted || isGameSoundsMuted ? 0 : gameSoundsVolume);
    yield call([sessionStorage, 'setItem'], SessionStorageKeys.soundsConfig, JSON.stringify(soundsConfig));
  } catch (error) {
    yield handleError(error, i18next.t('UserEvents.SoundsConfig.ChangeError'));
  }
}

function* handleInitUserInMachine() {
  try {
    yield call(pubSubClient.initUserInMachine);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleRestoreConnection() {
  const socketURL = yield call([sessionStorage, sessionStorage.getItem], SessionStorageKeys.socketURL);
  const sessionId = yield call([sessionStorage, sessionStorage.getItem], SessionStorageKeys.sessionId);
  const idleTimeoutStartTimestamp = yield call([sessionStorage, sessionStorage.getItem], SessionStorageKeys.idleTimeoutStartTimestamp);
  const footprint = yield call(getOrGenerateFootprint);

  if (socketURL && sessionId && footprint) {
    yield put(setAppLoader({
      isLoading: true,
      message: i18next.t('Root.Loading'),
    }));

    yield put(pubSubRestoreConnection({
      url: socketURL,
      sessionId,
      footprint,
    }));

    if (idleTimeoutStartTimestamp) {
      yield put(setIdleTimeoutStartTimestamp({
        timestamp: +idleTimeoutStartTimestamp,
      }));
    }
  } else {
    yield put(goToTheOperatorLobby());
  }
}

export function* handleSessionChange() {
  try {
    while (true) {
      const { sessionId: oldSessionId, sessionStatus: oldSessionStatus } = yield select(sessionSelector);

      yield take([setSession, setSessionStatus]);

      const { sessionId: newSessionId, sessionStatus: newSessionStatus } = yield select(sessionSelector);

      if (isPlayingSessionStatus(newSessionStatus)) {
        soundsController.playBackgroundSound(BackgroundSound.game);
      } else if (isPassiveSessionStatus(newSessionStatus)) {
        soundsController.playBackgroundSound(BackgroundSound.queue);
      }

      if (oldSessionStatus !== newSessionStatus) {
        yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.sessionStatus, newSessionStatus);

        if (isPlayingSessionStatus(newSessionStatus)) {
          yield put(mergeOverlay({ isRegularRoundStartVisible: true }));
        }

        if (!isAutoplaySessionStatus(oldSessionStatus) && isAutoplaySessionStatus(newSessionStatus)) {
          const { config } = yield select(autoplaySelector);

          yield call(pubSubClient.enableAutoplay, config);
        } else if (isAutoplaySessionStatus(oldSessionStatus) && !isAutoplaySessionStatus(newSessionStatus)) {
          yield call(pubSubClient.disableAutoplay);
        }
      }

      if (oldSessionId !== newSessionId) {
        yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.sessionId, newSessionId);
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleNetworkStatusChange() {
  let isOnline = true;

  while (true) {
    try {
      yield call(fetch, `${window.location.origin}/networkCheckHelper.json?timestamp=${Date.now()}`);

      if (!isOnline) {
        yield put(restoreConnection());
      }

      isOnline = true;
    } catch (error) {
      isOnline = false;
      yield put(setIsLostConnection({ isLostConnection: true }));
    }

    yield delay(NETWORK_STATUS_CHECK_INTERVAL);
  }
}

function* handleQuit({ payload }: ReturnType<typeof quit>) {
  try {
    yield call(pubSubClient.quit, payload);
    yield put(goToTheOperatorLobby());
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetResult({ payload }: ReturnType<typeof setResult>) {
  try {
    if (payload?.isOpen) {
      yield call(soundsController.playGameEventSound, GameEventSound.sessionResult);
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleNotification({ payload }: ReturnType<typeof notification>) {
  try {
    const { notificationId, message, data } = payload;

    switch (notificationId) {
      case NotificationType.insufficientFunds:
        soundsController.playSoundEffect(SoundEffect.disappoint);
        toast.warn(i18next.t(`Notification.${notificationId}`, { value: data?.canBuy }) || message);
        break;
      case NotificationType.roundLimitReached:
        toast.warn(i18next.t(`Notification.${notificationId}`) || message);
        break;
      case NotificationType.betFailed:
      case NotificationType.loginFailed:
      case NotificationType.payoutFailed:
      case NotificationType.restoreConnectionFailed:
        toast.error(i18next.t(`Notification.${notificationId}`) || message);
        break;
      default:
        break;
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleForceGoToLobby() {
  try {
    const { isOpen } = yield select(resultDialogSelector);

    if (!isOpen) {
      yield put(goToTheOperatorLobby());
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleGoToTheOperatorLobby() {
  try {
    toast.info(i18next.t('App.ReturnToLobbyToast'), { autoClose: TOAST_AUTO_HIDE_DURATION });
    yield delay(TOAST_AUTO_HIDE_DURATION);

    const homeUrl = sessionStorage.getItem(SessionStorageKeys.homeUrl);

    if (homeUrl) {
      window.location.replace(homeUrl);
    } else {
      history.push(ROUTES_MAP.exit.path);
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleChangeOrientation() {
  try {
    const events: IChangeOrientationData[] = [];
    const isOrientationAction = isAllOf(changeOrientation);

    while (true) {
      const action = yield take([changeOrientation, setSession]);

      if (isOrientationAction(action)) {
        yield events.push(action.payload);
      }

      if (pubSubClient.isSocketConnected()) {
        yield all(events.map((event) => (
          call(pubSubClient.sendUserEventNotification, { type: PubSubUserEventNotification.orientationChanged, data: event })
        )));
        events.splice(0, events.length);
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

export function* appSagas() {
  yield all([
    yield takeLatest(
      pubSubConnectAndLoginSuccess,
      handlePubSubConnectSuccess,
    ),
    yield takeLatest(
      mergeSoundsConfig,
      handleChangeSoundsConfig,
    ),
    yield takeLatest(
      initUserInMachine,
      handleInitUserInMachine,
    ),
    yield takeLatest(
      restoreConnection,
      handleRestoreConnection,
    ),
    yield fork(handleSessionChange),
    yield fork(handleNetworkStatusChange),
    yield fork(handleChangeOrientation),
    yield takeLatest(
      quit,
      handleQuit,
    ),
    yield takeLatest(
      setResult,
      handleSetResult,
    ),
    yield takeEvery(
      notification,
      handleNotification,
    ),
    yield takeLatest(
      forceGoToLobby,
      handleForceGoToLobby,
    ),
    yield takeLatest(
      goToTheOperatorLobby,
      handleGoToTheOperatorLobby,
    ),
  ]);
}

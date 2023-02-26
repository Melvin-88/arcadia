import {
  all, call, debounce, delay, put, race, select, take, takeEvery, takeLatest,
} from 'redux-saga/effects';
import i18next from 'i18next';
import { isAllOf } from '@reduxjs/toolkit';
import { PubSubClient } from '../../../services/pubSubClient/client';
import {
  addChipToChipWinQueue,
  fire,
  fireStop,
  removeChipFromChipWinQueue,
  roundStart,
  sendRailPosition,
  setCoins,
  setIsDetectingDroppedChips,
  setIdleTimeoutStartTimestamp,
  cancelStacks,
  setActiveRound,
  removePhantomChipWinQueueItem,
} from './actions';
import { SoundsController } from '../../../services/sounds/controller';
import { GameEventSound } from '../../../services/sounds/types';
import { handleError } from '../../../services/sagasErrorHandler';
import { buyRounds } from '../../buy/state/actions';
import { overlaySelector } from '../../overlay/state/selectors';
import {
  CHIP_DETECTION_VISIBILITY_TIME,
  CHIP_WIN_VISIBILITY_TIME,
  BET_BEHIND_STATUS_RESET_TIMEOUT,
  MACHINE_SEEDING_DETECTION_DELAY,
} from '../constants';
import { RoundType } from '../../../types/round';
import { mergeBetBehind } from '../../betBehind/state/actions';
import { BetBehindStatus } from '../../../types/betBehind';
import { appStateSelector, sessionSelector } from '../../app/selectors';
import { isBetBehindSessionStatus } from '../../../services/general';
import { setRounds } from '../../app/actions';
import { SessionStorageKeys } from '../../../constants';
import { mergeOverlay } from '../../overlay/state/actions';
import { setTutorial } from '../../tutorial/state/actions';
import { setQueue } from '../../queue/actions';
import { SessionStatus } from '../../../types/session';
import { gameSelector } from './selectors';

const pubSubClient = PubSubClient.getInstance();
const soundsController = SoundsController.getInstance();

function* handleBuyStacks({ payload }: ReturnType<typeof buyRounds>) {
  try {
    yield call(pubSubClient.buyRounds, { stacks: payload.rounds, voucherId: payload.voucherId });
  } catch (error) {
    yield handleError(error, i18next.t('UserEvents.Buy.DefaultError'));
  }
}

function* handleSetCoins({ payload }: ReturnType<typeof setCoins>) {
  try {
    const { sessionStatus } = yield select(sessionSelector);

    if (payload.coins === 0 && isBetBehindSessionStatus(sessionStatus)) {
      const { roundStartAction } = yield race({
        timeout: delay(BET_BEHIND_STATUS_RESET_TIMEOUT),
        roundStartAction: take(roundStart),
      });

      if (roundStartAction?.payload?.type !== RoundType.betBehind) {
        yield put(mergeBetBehind({ betBehindStatus: BetBehindStatus.pendingStart }));
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleRoundStart({ payload }: ReturnType<typeof roundStart>) {
  try {
    const { rounds } = yield select(sessionSelector);

    yield put(setTutorial({ isOpened: false }));
    yield put(mergeOverlay({ isMachineSeedingVisible: false }));
    yield put(setActiveRound({
      activeRound: {
        type: payload.type,
      },
    }));

    switch (payload.type) {
      case RoundType.regular:
      case RoundType.voucher: {
        yield put(setRounds({ rounds: Math.max(rounds - 1, 0) }));
        break;
      }

      case RoundType.scatter: {
        yield put(setRounds({ rounds: Math.max(rounds - 1, 0) }));
        yield put(mergeOverlay({ isScatterRoundStartVisible: true }));
        break;
      }

      case RoundType.betBehind: {
        yield put(mergeBetBehind({ betBehindStatus: BetBehindStatus.playing }));
        break;
      }

      default:
        break;
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleFire() {
  try {
    yield call(pubSubClient.openFire);
  } catch (error) {
    yield handleError(error, i18next.t('UserEvents.Fire.DefaultError'));
  }
}

function* handleFireStop() {
  try {
    yield call(pubSubClient.ceaseFire);
  } catch (error) {
    yield handleError(error, i18next.t('UserEvents.FireStop.DefaultError'));
  }
}

function* handleSendRailPosition({ payload }: ReturnType<typeof sendRailPosition>) {
  try {
    yield call(pubSubClient.setAngle, { angle: payload.railPosition });
  } catch (error) {
    yield handleError(error, i18next.t('UserEvents.Rail.SendPositionError'));
  }
}

function* handleAddChipToChipWinQueue({ payload }: ReturnType<typeof addChipToChipWinQueue>) {
  try {
    const { id, soundId } = payload;

    yield delay(CHIP_WIN_VISIBILITY_TIME);
    yield put(removeChipFromChipWinQueue({ id }));
    yield call(soundsController.playChipWinSound, soundId);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetIsDetectingDroppedChips() {
  try {
    yield call(soundsController.playGameEventSound, GameEventSound.chipDetection);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleChipDetectionDebounce({ payload }: ReturnType<typeof setIsDetectingDroppedChips>) {
  if (payload.value) {
    yield put(setIsDetectingDroppedChips({ value: false }));
  }
}

function* handleSetIdleTimeoutStartTimestamp({ payload }: ReturnType<typeof setIdleTimeoutStartTimestamp>) {
  try {
    const timestamp = payload.timestamp ? JSON.stringify(payload.timestamp) : '';

    yield call([sessionStorage, sessionStorage.setItem], SessionStorageKeys.idleTimeoutStartTimestamp, timestamp);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleCancelStacks() {
  try {
    yield call(pubSubClient.cancelStacks);
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetQueue({ payload }: ReturnType<typeof setQueue>) {
  try {
    const { queue } = payload;
    const { queueToken: firstUserInQueueToken, status: firstUserInQueueStatus } = queue[0] || {};
    const { queueToken } = yield select(appStateSelector);

    if (firstUserInQueueStatus === SessionStatus.queue && firstUserInQueueToken && queueToken && firstUserInQueueToken === queueToken) {
      const { roundStartAction } = yield race({
        timeout: delay(MACHINE_SEEDING_DETECTION_DELAY),
        roundStartAction: take(roundStart),
      });

      const { activeRound } = yield select(gameSelector);

      if (!roundStartAction && !activeRound) {
        yield put(mergeOverlay({ isMachineSeedingVisible: true }));
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* checkNextRoundReady(action: ReturnType<typeof mergeOverlay>) {
  try {
    const isMergeOverlayAction = isAllOf(mergeOverlay)(action);

    if (isMergeOverlayAction && action.payload.isScatterRoundWonVisible !== false) {
      return;
    }

    const { phantomChipWinQueue, coins } = yield select(gameSelector);
    const { isScatterRoundWonVisible } = yield select(overlaySelector);

    if (!phantomChipWinQueue.length && !isScatterRoundWonVisible && coins === 0) {
      yield call(pubSubClient.readyForNextRound);
    }
  } catch (error) {
    handleError(error);
  }
}

export function* gameSagas() {
  yield all([
    yield takeLatest(
      buyRounds,
      handleBuyStacks,
    ),
    yield takeLatest(
      setCoins,
      handleSetCoins,
    ),
    yield takeLatest(
      roundStart,
      handleRoundStart,
    ),
    yield takeLatest(
      fire,
      handleFire,
    ),
    yield takeLatest(
      fireStop,
      handleFireStop,
    ),
    yield takeLatest(
      sendRailPosition,
      handleSendRailPosition,
    ),
    yield takeLatest(
      setIdleTimeoutStartTimestamp,
      handleSetIdleTimeoutStartTimestamp,
    ),
    yield takeEvery(
      addChipToChipWinQueue,
      handleAddChipToChipWinQueue,
    ),
    yield takeEvery(
      cancelStacks,
      handleCancelStacks,
    ),
    yield takeEvery(
      setIsDetectingDroppedChips,
      handleSetIsDetectingDroppedChips,
    ),
    yield debounce(
      CHIP_DETECTION_VISIBILITY_TIME,
      setIsDetectingDroppedChips,
      handleChipDetectionDebounce,
    ),
    yield takeEvery(
      setQueue,
      handleSetQueue,
    ),
    yield takeLatest(
      [mergeOverlay, removePhantomChipWinQueueItem, setCoins],
      checkNextRoundReady,
    ),
  ]);
}

import {
  all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  processBlueRibbonPlayerOptEvent,
  processBlueRibbonWinEvent,
  setJackpotActiveGameId,
  setJackpotIsOptInEnabled,
  setJackpotWinData,
  setupJackpot,
} from './actions';
// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { BlueRibbonController } from '../services/blueRibbon';
import { SoundsController } from '../../../services/sounds/controller';
import { GameEventSound } from '../../../services/sounds/types';
import { sessionSelector } from '../../app/selectors';
import { jackpotSelector } from './selectors';

// TODO: Remove lowercasing of the "currentPlayerId" after relative fix will be deployed at the BlueRibbon side BEGIN
// BlueRibbon promised to fix it in the Slack channel at January 2021
// BlueRibbon fully approved that in case they're lowercasing playerId at their side
// it's okay to lowercase our internal playerId while comparing
const isPlayerIdsEqual = (arcadiaPlayerId: string, blueRibbonPlayerId: string) => (
  arcadiaPlayerId.toLowerCase() === blueRibbonPlayerId.toLowerCase()
);
// TODO: Remove lowercasing of the "currentPlayerId" after relative fix will be deployed at the BlueRibbon side END

const blueRibbonController = BlueRibbonController.getInstance();
const soundsController = SoundsController.getInstance();

function* handleSetupJackpot({ payload }: ReturnType<typeof setupJackpot>) {
  const { activeGameId, ...mainSetupData } = payload;

  try {
    yield call(blueRibbonController.setup, mainSetupData);

    if (activeGameId) {
      yield put(setJackpotActiveGameId({ gameId: activeGameId }));
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetJackpotActiveGameId({ payload }: ReturnType<typeof setJackpotActiveGameId>) {
  try {
    const { playerOptState } = yield call(blueRibbonController.isPlayerOptInToJackpotGame, { gameId: payload.gameId });
    const { activeGameId } = yield select(jackpotSelector);
    const { playerId: currentPlayerId } = yield select(sessionSelector);

    const { gameId, playerId, isOptIn } = playerOptState;

    if (activeGameId === gameId && isPlayerIdsEqual(currentPlayerId, playerId)) {
      yield put(setJackpotIsOptInEnabled({
        gameId,
        isOptInEnabled: isOptIn,
        withoutUpdateRequest: true,
      }));
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleSetJackpotIsOptInEnabled({ payload }: ReturnType<typeof setJackpotIsOptInEnabled>) {
  try {
    const { gameId, isOptInEnabled, withoutUpdateRequest } = payload;

    if (!withoutUpdateRequest) {
      const requestData = { gameId };

      if (isOptInEnabled) {
        yield call(blueRibbonController.optInPlayerToJackpotGame, requestData);
      } else {
        yield call(blueRibbonController.optOutPlayerToJackpotGame, requestData);
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleProcessBlueRibbonPlayerOptEvent({ payload }: ReturnType<typeof processBlueRibbonPlayerOptEvent>) {
  try {
    const { playerId: currentPlayerId } = yield select(sessionSelector);
    const { activeGameId } = yield select(jackpotSelector);
    const { gameId, playerId, isOptInEnabled } = payload;

    if (activeGameId === gameId && isPlayerIdsEqual(currentPlayerId, playerId)) {
      yield put(setJackpotIsOptInEnabled({
        gameId,
        isOptInEnabled,
        withoutUpdateRequest: true,
      }));
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleProcessBlueRibbonWinEvent({ payload }: ReturnType<typeof processBlueRibbonWinEvent>) {
  try {
    const { winningDetails } = payload;
    const { gameId, playerId } = winningDetails;
    const { playerId: currentPlayerId } = yield select(sessionSelector);
    const { activeGameId } = yield select(jackpotSelector);

    if (activeGameId === gameId && isPlayerIdsEqual(currentPlayerId, playerId)) {
      soundsController.playGameEventSound(GameEventSound.jackpotWin);
      yield put(setJackpotWinData(winningDetails));
    }
  } catch (error) {
    yield handleError(error);
  }
}

export function* jackpotSagas() {
  yield all([
    yield takeLatest(
      setupJackpot,
      handleSetupJackpot,
    ),
    yield takeLatest(
      setJackpotActiveGameId,
      handleSetJackpotActiveGameId,
    ),
    yield takeLatest(
      setJackpotIsOptInEnabled,
      handleSetJackpotIsOptInEnabled,
    ),
    yield takeEvery(
      processBlueRibbonPlayerOptEvent,
      handleProcessBlueRibbonPlayerOptEvent,
    ),
    yield takeEvery(
      processBlueRibbonWinEvent,
      handleProcessBlueRibbonWinEvent,
    ),
  ]);
}

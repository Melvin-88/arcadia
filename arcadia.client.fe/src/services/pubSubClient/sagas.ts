import {
  all, call, fork, put, take, takeLatest,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import {
  forceGoToLobby,
  initUserInMachine,
  notification,
  setAppLoader,
  setIsLostConnection,
  setQueueToken,
  setResult,
  setRounds,
  setRoundsBuyLimit,
  setSession,
  setSessionStatus,
  setShortestQueueProposal,
} from '../../modules/app/actions';
import { mergeAutoplay, setAutoplayConfig } from '../../modules/autoplay/state/actions';
import { PubSubClient } from './client';
import { SubscribeEventType } from './constants';
import { setQueue } from '../../modules/queue/actions';
import { handleError } from '../sagasErrorHandler';
import { AutoplayStatus, RobotAction } from './types';
import { setBuy, setVoucher } from '../../modules/buy/state/actions';
import {
  addChipToChipWinQueue,
  addPhantomChipWinQueueItem,
  roundStart,
  setActiveRound,
  setBalance,
  setCoins,
  setIdleTimeoutStartTimestamp,
  setIsDetectingDroppedChips,
  setTotalWin,
} from '../../modules/game/state/actions';
import {
  pubSubConnectAndLogin,
  pubSubConnectAndLoginError,
  pubSubConnectAndLoginSuccess,
  pubSubForceDisconnect,
  pubSubRestoreConnection,
} from './actions';
import { setJackpotActiveGameId, setupJackpot } from '../../modules/jackpot/state/actions';
import { mergeBetBehind, setBetBehindConfig } from '../../modules/betBehind/state/actions';
import { mergeChangeBet, setGroups } from '../../modules/changeBet/state/actions';
import { resetState } from '../../store/actions';
import { SessionStatus } from '../../types/session';

const pubSubClient = PubSubClient.getInstance();

function* handleSubscribe() {
  const channel = eventChannel((emit) => {
    pubSubClient
      .on(SubscribeEventType.connect, () => {
        emit(setIsLostConnection({ isLostConnection: false }));
      })
      .on(SubscribeEventType.login, ({
        autoplayConfig, betBehindConfig, jackpotGameId, ...sessionData
      }) => {
        emit(setSession({ session: sessionData }));
        emit(setAutoplayConfig(autoplayConfig));
        emit(setBetBehindConfig(betBehindConfig));

        if (jackpotGameId) {
          emit(setJackpotActiveGameId({ gameId: jackpotGameId }));
        }

        emit(setAppLoader());
        pubSubClient.requestBalance();
      })
      .on(SubscribeEventType.restoreConnection, ({
        playerId,
        currency,
        activeRound,
        coins,
        rounds,
        queueToken,
        totalWin,
        blueRibbonBaseServiceUrl,
        blueRibbonOperatorId,
        jackpotGameId,
        sessionStatus,
        ...restSessionData
      }) => {
        emit(setActiveRound({ activeRound: activeRound || null }));
        emit(setCoins({ coins }));
        emit(setRounds({ rounds }));
        emit(setQueueToken({ queueToken }));
        emit(setTotalWin({ totalWin }));
        emit(setSession({
          session: {
            ...restSessionData,
            sessionStatus,
            rounds,
            currency,
            playerId,
          },
        }));
        emit(setupJackpot({
          baseServiceUrl: blueRibbonBaseServiceUrl,
          operatorId: blueRibbonOperatorId,
          activeGameId: jackpotGameId,
          playerId,
          currency,
        }));
        emit(setAppLoader());

        if (sessionStatus === SessionStatus.reBuy) {
          emit(setBuy({ isOpen: true }));
        }
        pubSubClient.requestBalance();
      })
      .on(SubscribeEventType.sessionState, (data) => {
        emit(setSessionStatus(data));

        if (typeof data.roundsLeft === 'number') {
          emit(setRounds({ rounds: data.roundsLeft }));
        }
      })
      .on(SubscribeEventType.queue, (data) => {
        emit(setQueue(data));
      })
      .on(SubscribeEventType.buy, (data) => {
        emit(setQueueToken(data));
        emit(setRounds(data));
        emit(setBuy());
      })
      .on(SubscribeEventType.reBuy, ({ roundsAllowed }) => {
        emit(mergeBetBehind({ isSnackbarOpen: false }));
        emit(mergeChangeBet({ isSnackbarOpen: false }));
        emit(mergeAutoplay({ isSnackbarOpen: false }));
        emit(setBuy({ isOpen: true }));
        emit(setRoundsBuyLimit({ stackBuyLimit: roundsAllowed }));
        emit(setIdleTimeoutStartTimestamp({ timestamp: Date.now() }));
      })
      .on(SubscribeEventType.remainingCoins, ({ remainingCoins }) => {
        emit(setCoins({ coins: remainingCoins }));
      })
      .on(SubscribeEventType.roundStart, (data) => {
        emit(roundStart(data));
      })
      .on(SubscribeEventType.robot2player, (data) => {
        const { action, error } = data;

        switch (true) {
          case action === RobotAction.ready:
            emit(initUserInMachine());
            break;
          case action === RobotAction.chipDetection:
            emit(setIsDetectingDroppedChips({ value: true }));
            break;
          case !!error:
            toast.error(error);
            break;
          default:
        }
      })
      .on(SubscribeEventType.win, (data) => {
        emit(addChipToChipWinQueue({
          ...data,
          id: uuidv4(),
        }));
      })
      .on(SubscribeEventType.phantom, ({ value }) => {
        emit(addPhantomChipWinQueueItem({
          id: uuidv4(),
          value,
          isSubtractedFromTotalWin: true,
        }));
      })
      .on(SubscribeEventType.sessionResult, (data) => {
        emit(setBuy({ isOpen: false }));
        emit(setResult({
          ...data,
          isOpen: true,
          totalWin: Number.parseFloat(data.totalWin.toString()), // TODO: Remove temp solution after backend data type change
        }));
        emit(setIdleTimeoutStartTimestamp({ timestamp: null }));
      })
      .on(SubscribeEventType.resetIdleTimeout, () => {
        emit(setIdleTimeoutStartTimestamp({ timestamp: Date.now() }));
      })
      .on(SubscribeEventType.balance, (data) => {
        emit(setBalance(data));
      })
      .on(SubscribeEventType.totalWin, (data) => {
        emit(setTotalWin(data));
      })
      .on(SubscribeEventType.voucher, (data) => {
        emit(setVoucher(data));
      })
      .on(SubscribeEventType.autoplay, ({ status, ...restData }) => {
        emit(mergeAutoplay({
          ...restData,
          isEnabled: status === AutoplayStatus.forcedEnable,
        }));
      })
      .on(SubscribeEventType.bets, (data) => {
        emit(setGroups(data));
      })
      .on(SubscribeEventType.shortestQueueProposal, (data) => {
        emit(setShortestQueueProposal(data));
      })
      .on(SubscribeEventType.disconnect, (reason) => {
        if (reason !== 'io client disconnect') {
          emit(setIsLostConnection({ isLostConnection: true }));
        }
      })
      .on(SubscribeEventType.notification, (data) => {
        emit(notification(data));
      })
      .on(SubscribeEventType.returnToLobby, () => {
        emit(forceGoToLobby());
      });

    return () => {};
  });

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function* handleConnectAndLogin({ payload }: ReturnType<typeof pubSubConnectAndLogin>) {
  try {
    yield call(pubSubClient.connect, payload);
    yield call(pubSubClient.login, payload);
    yield put(pubSubConnectAndLoginSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(pubSubConnectAndLoginError());
  }
}

function* handleRestoreConnection({ payload }: ReturnType<typeof pubSubRestoreConnection>) {
  try {
    yield call(pubSubClient.connect, { url: payload.url });
    yield call(pubSubClient.restoreConnection, payload);
    yield put(pubSubConnectAndLoginSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(pubSubConnectAndLoginError());
  }
}

function* handleForceDisconnect() {
  try {
    yield call(pubSubClient.forceDisconnect);
    yield put(resetState());
  } catch (error) {
    yield handleError(error);
  }
}

export function* pubSubSagas() {
  yield all([
    yield takeLatest(
      pubSubConnectAndLogin,
      handleConnectAndLogin,
    ),
    yield takeLatest(
      pubSubRestoreConnection,
      handleRestoreConnection,
    ),
    yield takeLatest(
      pubSubForceDisconnect,
      handleForceDisconnect,
    ),
    yield fork(handleSubscribe),
  ]);
}

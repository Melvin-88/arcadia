import {
  all, call, fork, put, select, take, takeLatest,
} from 'redux-saga/effects';
import { leaveQueue, setQueue } from './actions';
import { setRounds } from '../app/actions';
import { handleError } from '../../services/sagasErrorHandler';
import { PubSubClient } from '../../services/pubSubClient/client';
import { SoundsController } from '../../services/sounds/controller';
import { GameEventSound } from '../../services/sounds/types';
import { queueSelector } from './selectors';
import { IQueuePlayer } from '../../types/queue';

const pubSubClient = PubSubClient.getInstance();
const soundsController = SoundsController.getInstance();

function* handleQueueChange() {
  try {
    while (true) {
      const { queue: oldQueue } = yield select(queueSelector);

      yield take(setQueue);

      const { queue: newQueue } = yield select(queueSelector);

      const isQueueNotSameLength = oldQueue.length !== newQueue.length;
      const isQueueNotEqual = isQueueNotSameLength || (!isQueueNotSameLength && oldQueue.some((queueItem: IQueuePlayer, index: number) => {
        const isTokenNotEqual = queueItem.queueToken !== newQueue[index].queueToken;

        return newQueue[index] && isTokenNotEqual;
      }));

      if (isQueueNotEqual) {
        yield call(soundsController.playGameEventSound, GameEventSound.queue);
      }
    }
  } catch (error) {
    yield handleError(error);
  }
}

function* handleLeaveQueue() {
  try {
    yield call(pubSubClient.leaveQueue);
    yield put(setRounds({ rounds: 0 }));
  } catch (error) {
    yield handleError(error);
  }
}

export function* queueSagas() {
  yield all([
    yield fork(handleQueueChange),
    yield takeLatest(
      leaveQueue,
      handleLeaveQueue,
    ),
  ]);
}

import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import queryString from 'query-string';
import papaparse from 'papaparse';
import {
  getDateTimeFormatted, saveStringAsFile, formatCurrency,
} from 'arcadia-common-fe';
import {
  getPlayers,
  getPlayersSuccess,
  getPlayersError,
  executePlayersAction,
  mergePlayersDialogAction,
  setPlayersDialogAction,
  exportPlayers,
  exportPlayersError,
  exportPlayersSuccess,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import { IGetPlayersRequestFilterParams, IGetPlayersResponseBody, PlayerAction } from '../types';
import { blockPlayersRequest, getPlayersRequest, unblockPlayersRequest } from '../api';
import { playerStatusLabelMap } from '../constants';

function* handleRefreshList() {
  yield put(getPlayers(queryString.parse(window.location.search)));
}

function* handleGetPlayersRequest(requestParams: IGetPlayersRequestFilterParams) {
  const { data } = yield call(getPlayersRequest, requestParams);

  return data;
}

export function* handleGetPlayers({ payload }: ReturnType<typeof getPlayers>) {
  try {
    const playersData: IGetPlayersResponseBody = yield handleGetPlayersRequest(payload);

    yield put(getPlayersSuccess(playersData));
  } catch (error) {
    yield handleError(error);
    yield put(getPlayersError());
  }
}

export function* handleExecutePlayersAction({ payload }: ReturnType<typeof executePlayersAction>) {
  try {
    const { action } = payload;

    if (action === PlayerAction.block) {
      yield call(blockPlayersRequest, payload);
    } else if (action === PlayerAction.unblock) {
      yield call(unblockPlayersRequest, payload);
    }
    yield put(setPlayersDialogAction());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergePlayersDialogAction({ isLoading: false }));
  }
}

function* handleExportPlayers({ payload }: ReturnType<typeof exportPlayers>) {
  try {
    const { players }: IGetPlayersResponseBody = yield handleGetPlayersRequest(payload);

    const preparedData = players.map((player) => {
      const {
        cid, currency, status, operatorName, bets, wins, netCash, createdDate, lastSessionDate,
      } = player;

      return {
        Status: playerStatusLabelMap[status],
        'Operator name': operatorName,
        'Player CID': cid,
        Bets: formatCurrency(bets, currency),
        Wins: formatCurrency(wins, currency),
        Netcash: formatCurrency(netCash, currency),
        Created: getDateTimeFormatted(createdDate),
        'Last Session': getDateTimeFormatted(lastSessionDate),
      };
    });

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'players.csv');
    yield put(exportPlayersSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportPlayersError());
  }
}

export function* playersSagas() {
  yield all([
    yield takeLatest(
      getPlayers,
      handleGetPlayers,
    ),
    yield takeLatest(
      executePlayersAction,
      handleExecutePlayersAction,
    ),
    yield takeLatest(
      exportPlayers,
      handleExportPlayers,
    ),
  ]);
}

import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getPlayerStatsReport,
  getPlayerStatsReportSuccess,
  getPlayerStatsReportError,
  exportPlayerStatsReport,
  exportPlayerStatsReportError,
  exportPlayerStatsReportSuccess,
  clearPlayerStatsReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getPlayerStatsReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IPlayerStatsReportItem, IGetPlayerStatsReportResponseBody } from '../types';

function* handleGetPlayerStatsReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getPlayerStatsReportRequest, requestParams);

  return data;
}

function* handleGetPlayerStatsReport({ payload }: ReturnType<typeof getPlayerStatsReport>) {
  try {
    const playerStatsReportData: IGetPlayerStatsReportResponseBody = yield handleGetPlayerStatsReportRequest(payload);
    const { info } = playerStatsReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearPlayerStatsReport());
    } else {
      yield put(getPlayerStatsReportSuccess(playerStatsReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getPlayerStatsReportError());
  }
}

function* handleExportPlayerStatsReport({ payload }: ReturnType<typeof exportPlayerStatsReport>) {
  try {
    const { data }: IGetPlayerStatsReportResponseBody = yield handleGetPlayerStatsReportRequest(payload);

    const preparedData = data.map((item: IPlayerStatsReportItem) => ({
      'Player ID': item.grouping_value,
      Sessions: item.total_unique_sessions,
      'Total session time': item.total_session_time,
      'Avg session time': item.avg_session_time,
      Rounds: item.total_rounds_played,
      'Avg rounds per session': item.avg_rounds_per_session,
      Bets: item.total_bets,
      Wins: item.total_wins,
      'Bets behind': item.total_behind_bets,
      'Wins behind': item.total_behind_wins,
      'Voucher bets': item.total_voucher_bets,
      'Voucher wins': item.total_voucher_wins,
      Refunds: item.total_refunds,
      'Gross gaming': item.total_gross_gaming,
      'Net gaming': item.total_net_gaming,
      'Watch time': item.total_watch_time,
      'Avg watch time': item.avg_watch_time,
      'Max watch time': item.max_watch_time,
      'Queue time': item.total_queue_time,
      'Avg queue time': item.avg_queue_time,
      'Max queue time': item.max_queue_time,
      'In play time': item.total_in_play_time,
      'Avg in play time': item.avg_in_play_time,
      'Max in play time': item.max_in_play_time,
      'Autoplay bets': item.total_autoplay_bets,
      'Autoplay wins': item.total_autoplay_wins,
      'Autoplay sessions %': item.percent_autoplay_sessions,
      'Sessions watch': item.total_sessions_watch,
      'Sessions watch %': item.percent_sessions_watch,
      'Sessions queue': item.total_sessions_queue,
      'Sessions queue %': item.percent_sessions_queue,
      'Sessions behind': item.total_sessions_behind,
      'Sessions behind %': item.percent_sessions_behind,
      'Sessions in play': item.total_sessions_in_play,
      'Sessions in play %': item.percent_sessions_in_play,
      LTV: item.ltv,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Player stats report.csv');
    yield put(exportPlayerStatsReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportPlayerStatsReportError());
  }
}

export function* playerStatsReportSagas() {
  yield all([
    yield takeLatest(
      getPlayerStatsReport,
      handleGetPlayerStatsReport,
    ),
    yield takeLatest(
      exportPlayerStatsReport,
      handleExportPlayerStatsReport,
    ),
  ]);
}

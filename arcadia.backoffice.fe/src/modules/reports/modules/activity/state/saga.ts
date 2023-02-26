import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getActivityReport,
  getActivityReportSuccess,
  getActivityReportError,
  exportActivityReport,
  exportActivityReportError,
  exportActivityReportSuccess,
  clearActivityReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getActivityReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IActivityReportItem, IGetActivityReportResponseBody } from '../types';

function* handleGetActivityReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getActivityReportRequest, requestParams);

  return data;
}

function* handleGetActivityReport({ payload }: ReturnType<typeof getActivityReport>) {
  try {
    const activityReportData: IGetActivityReportResponseBody = yield handleGetActivityReportRequest(payload);
    const { info } = activityReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearActivityReport());
    } else {
      yield put(getActivityReportSuccess(activityReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getActivityReportError());
  }
}

function* handleExportActivityReport({ payload }: ReturnType<typeof exportActivityReport>) {
  try {
    const { data }: IGetActivityReportResponseBody = yield handleGetActivityReportRequest(payload);

    const preparedData = data.map((item: IActivityReportItem) => ({
      'Grouping value': item.grouping_value,
      '# players': item.total_unique_players,
      '# new players': item.total_new_players,
      '# sessions': item.total_unique_sessions,
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
      'Average in play time': item.avg_in_play_time,
      'Max in play time': item.max_in_play_time,
      'Autoplay bets': item.total_autoplay_bets,
      'Autoplay wins': item.total_autoplay_wins,
      'Autoplay % of sessions': item.percent_autoplay_sessions,
      '# sessions watch': item.total_sessions_watch,
      'Sessions watch %': item.percent_sessions_watch,
      '# sessions queue': item.total_sessions_queue,
      'Sessions queue %': item.percent_sessions_queue,
      '# sessions behind': item.total_sessions_behind,
      'Sessions behind %': item.percent_sessions_behind,
      '# sessions in play': item.total_sessions_in_play,
      'Sessions in play %': item.percent_sessions_in_play,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'activity report.csv');
    yield put(exportActivityReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportActivityReportError());
  }
}

export function* activityReportSagas() {
  yield all([
    yield takeLatest(
      getActivityReport,
      handleGetActivityReport,
    ),
    yield takeLatest(
      exportActivityReport,
      handleExportActivityReport,
    ),
  ]);
}

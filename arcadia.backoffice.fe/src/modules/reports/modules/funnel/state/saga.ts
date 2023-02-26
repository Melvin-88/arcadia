import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getFunnelReport,
  getFunnelReportSuccess,
  getFunnelReportError,
  exportFunnelReport,
  exportFunnelReportError,
  exportFunnelReportSuccess,
  clearFunnelReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getFunnelReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IFunnelReportItem, IGetFunnelReportResponseBody } from '../types';

function* handleGetFunnelReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getFunnelReportRequest, requestParams);

  return data;
}

function* handleGetFunnelReport({ payload }: ReturnType<typeof getFunnelReport>) {
  try {
    const funnelReportData: IGetFunnelReportResponseBody = yield handleGetFunnelReportRequest(payload);
    const { info } = funnelReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearFunnelReport());
    } else {
      yield put(getFunnelReportSuccess(funnelReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getFunnelReportError());
  }
}

function* handleExportFunnelReport({ payload }: ReturnType<typeof exportFunnelReport>) {
  try {
    const { data }: IGetFunnelReportResponseBody = yield handleGetFunnelReportRequest(payload);

    const preparedData = data.map((item: IFunnelReportItem) => ({
      'Grouping value': item.grouping_value,
      '# unique players': item.total_unique_players,
      '# unique sessions': item.total_unique_sessions,
      'Total session time': item.total_session_time,
      'Avg session time': item.avg_session_time,
      Rounds: item.total_rounds_played,
      'Avg rounds per session': item.avg_rounds_per_session,
      'Watch time': item.total_watch_time,
      'Avg watch time': item.avg_watch_time,
      'Max watch time': item.max_watch_time,
      'Queue time': item.total_queue_time,
      'Avg queue time': item.avg_queue_time,
      'Max queue time': item.max_queue_time,
      'In play time': item.total_in_play_time,
      'Avg in play time': item.avg_in_play_time,
      'Max in play time': item.max_in_play_time,
      '# sessions watch': item.total_sessions_watch,
      '% sessions watch': item.percent_sessions_watch,
      '# sessions queue': item.total_sessions_queue,
      '% sessions queue': item.percent_sessions_queue,
      '# sessions behind': item.total_sessions_behind,
      '% sessions behind': item.percent_sessions_behind,
      '# sessions in play': item.total_sessions_in_play,
      '% sessions in plays': item.percent_sessions_in_play,
      '# sessions change denomination': item.total_sessions_change_denomination,
      '% sessions change denomination': item.percent_sessions_change_denomination,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Funnel report.csv');
    yield put(exportFunnelReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportFunnelReportError());
  }
}

export function* funnelReportSagas() {
  yield all([
    yield takeLatest(
      getFunnelReport,
      handleGetFunnelReport,
    ),
    yield takeLatest(
      exportFunnelReport,
      handleExportFunnelReport,
    ),
  ]);
}

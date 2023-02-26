import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import { saveStringAsFile } from 'arcadia-common-fe';
import {
  getMachineStatusReport,
  getMachineStatusReportSuccess,
  getMachineStatusReportError,
  exportMachineStatusReport,
  exportMachineStatusReportError,
  exportMachineStatusReportSuccess,
  clearMachineStatusReport,
} from './actions';
import { handleError } from '../../../../../services/sagasErrorHandler';
import { getMachineStatusReportRequest } from '../api';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IMachineStatusReportItem, IGetMachineStatusReportResponseBody } from '../types';

function* handleGetMachineStatusReportRequest(requestParams: IGetProcessedReportRequestFiltersParams) {
  const { data } = yield call(getMachineStatusReportRequest, requestParams);

  return data;
}

function* handleGetMachineStatusReport({ payload }: ReturnType<typeof getMachineStatusReport>) {
  try {
    const machineStatusReportData: IGetMachineStatusReportResponseBody = yield handleGetMachineStatusReportRequest(payload);
    const { info } = machineStatusReportData;

    if (info.inProgress || info.toCreate) {
      yield call(toast.info, 'Your report is preparing. Check the “Processed reports“ section in few minutes');
      yield put(clearMachineStatusReport());
    } else {
      yield put(getMachineStatusReportSuccess(machineStatusReportData));
    }
  } catch (error) {
    yield handleError(error);
    yield put(getMachineStatusReportError());
  }
}

function* handleExportMachineStatusReport({ payload }: ReturnType<typeof exportMachineStatusReport>) {
  try {
    const { data }: IGetMachineStatusReportResponseBody = yield handleGetMachineStatusReportRequest(payload);

    const preparedData = data.map((item: IMachineStatusReportItem) => ({
      'Grouping value': item.grouping_value,
      '# machines': item.total_machines,
      'Available time': item.total_available_time,
      'Available time %': item.percent_available_time,
      'In play time': item.total_in_play_time,
      'In play time %': item.percent_in_play_time,
      'Offline time': item.total_offline_time,
      'Offline time %': item.percent_offline_time,
      'Offline stopped time': item.total_stopped_time,
      'Stopped time %': item.percent_stopped_time,
      'Shutting down time': item.total_shutting_down_time,
      'Shutting down time %': item.percent_shutting_down_time,
      'Preparing time': item.total_preparing_time,
      'Preparing time %': item.percent_preparing_time,
      'Ready time': item.total_ready_time,
      'Ready time %': item.percent_ready_time,
      'Seeding time': item.total_seeding_time,
      'Seeding time %': item.percent_seeding_time,
      'Hold time': item.total_on_hold_time,
      'Hold time %': item.percent_on_hold_time,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'Machine status report.csv');
    yield put(exportMachineStatusReportSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportMachineStatusReportError());
  }
}

export function* machineStatusReportSagas() {
  yield all([
    yield takeLatest(
      getMachineStatusReport,
      handleGetMachineStatusReport,
    ),
    yield takeLatest(
      exportMachineStatusReport,
      handleExportMachineStatusReport,
    ),
  ]);
}

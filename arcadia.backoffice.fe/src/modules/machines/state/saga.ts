import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { secondsToTimeSpan, getDateTimeFormatted, saveStringAsFile } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  exportMachines,
  exportMachinesError,
  exportMachinesSuccess,
  getMachines,
  getMachinesError,
  getMachinesSuccess,
  setMachinesDialogAction,
  mergeMachinesDialogAction,
  executeMachinesAction,
  postMachine,
  mergeMachinesDialogForm,
  setMachinesDialogForm,
  putMachine,
  activateMachine,
  mergeDialogActivateMachine,
  setDialogActivateMachine,
  reassignMachine,
  mergeDialogReassignMachine,
  setDialogReassignMachine,
} from './actions';
import {
  getMachinesRequest,
  activateMachineRequest,
  dryMachineRequest,
  shutdownMachineRequest,
  removeMachineRequest,
  postMachineRequest,
  putMachineRequest,
  reassignMachineRequest,
  rebootMachineRequest,
} from '../api';
import { IGetMachinesRequestFiltersParams, IGetMachinesResponseBody, MachineAction } from '../types';
import { machineStatusLabelMap, queueStatusLabelMap } from '../constants';

function* handleGetMachinesRequest(requestParams: IGetMachinesRequestFiltersParams) {
  const { data } = yield call(getMachinesRequest, requestParams);

  return data;
}

function* handleRefreshMachines() {
  yield put(getMachines(queryString.parse(window.location.search)));
}

function* handlePostMachine({ payload }: ReturnType<typeof postMachine>) {
  try {
    yield put(mergeMachinesDialogForm({
      isLoading: true,
    }));

    yield call(postMachineRequest, payload);
    yield put(setMachinesDialogForm());
    yield call(toast.success, 'The machine has been successfully created');
    yield handleRefreshMachines();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMachinesDialogForm({
      isLoading: false,
    }));
  }
}

function* handleGetMachines({ payload }: ReturnType<typeof getMachines>) {
  try {
    const machinesData: IGetMachinesResponseBody = yield handleGetMachinesRequest(payload);

    yield put(getMachinesSuccess(machinesData));
  } catch (error) {
    yield handleError(error);
    yield put(getMachinesError());
  }
}

function* handlePutMachines({ payload }: ReturnType<typeof putMachine>) {
  try {
    yield put(mergeMachinesDialogForm({
      isLoading: true,
    }));

    yield call(putMachineRequest, payload);
    yield put(setMachinesDialogForm());
    yield call(toast.success, `The machine ${payload.name} has been successfully updated`);
    yield handleRefreshMachines();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMachinesDialogForm({
      isLoading: false,
    }));
  }
}

function* handleExportMachines({ payload }: ReturnType<typeof exportMachines>) {
  try {
    const { machines }: IGetMachinesResponseBody = yield handleGetMachinesRequest(payload);

    const preparedData = machines.map((machine) => ({
      'Machine Status': machineStatusLabelMap[machine.status],
      'Queue Status': queueStatusLabelMap[machine.queueStatus],
      'Machine ID': machine.id,
      'Machine Name': machine.name,
      'Group Name': machine.groupName,
      Site: machine.siteName,
      Observers: machine.viewers,
      'In Queue': machine.inQueue,
      Uptime: secondsToTimeSpan(machine.uptime || 0),
      'Video Link': machine.videoLink,
      'Serial number': machine.serial,
      'Camera ID': machine.cameraID,
      'Robot controller IP': machine.controllerIP,
      Location: machine.location,
      'Last diagnostic time': getDateTimeFormatted(machine.lastDiagnosticDate),
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'machines.csv');
    yield put(exportMachinesSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportMachinesError());
  }
}

function* handleExecuteMachineAction({ payload }: ReturnType<typeof executeMachinesAction>) {
  try {
    const { id, action } = payload;

    yield put(mergeMachinesDialogAction({ isLoading: true }));

    switch (action) {
      case MachineAction.dry:
        yield call(dryMachineRequest, payload);
        yield call(toast.success, `The machine with id ${id} has been successfully started drying.`);
        break;

      case MachineAction.shutdown:
        yield call(shutdownMachineRequest, payload);
        yield call(toast.success, `The machine with id ${id} has been successfully shutdown.`);
        break;

      case MachineAction.remove:
        yield call(removeMachineRequest, payload);
        yield call(toast.success, `The machine with id ${id} has been successfully removed.`);
        break;

      case MachineAction.reboot:
        yield call(rebootMachineRequest, payload);
        yield call(toast.success, `The machine with id ${id} has been successfully rebooted.`);
        break;

      default:
        break;
    }

    yield put(setMachinesDialogAction());
    yield handleRefreshMachines();
  } catch (error) {
    yield handleError(error);
    yield put(mergeMachinesDialogAction({ isLoading: false }));
  }
}

function* handleActivateMachine({ payload }: ReturnType<typeof activateMachine>) {
  try {
    const { id } = payload;

    yield put(mergeDialogActivateMachine({ isLoading: true }));
    yield call(activateMachineRequest, payload);
    yield call(toast.success, `The machine with id ${id} has been successfully activated.`);
    yield put(setDialogActivateMachine());
    yield handleRefreshMachines();
  } catch (error) {
    yield handleError(error);
    yield put(mergeDialogActivateMachine({ isLoading: false }));
  }
}

function* handleReassignMachine({ payload }: ReturnType<typeof reassignMachine>) {
  try {
    yield put(mergeDialogReassignMachine({ isLoading: true }));
    yield call(reassignMachineRequest, payload);
    yield call(
      toast.success,
      `Machine with id ${payload.id} assigned successfully to group with id ${payload.groupId}`,
    );
    yield put(setDialogReassignMachine());
    yield handleRefreshMachines();
  } catch (error) {
    yield handleError(error);
    yield put(mergeDialogReassignMachine({ isLoading: false }));
  }
}

export function* machinesSagas() {
  yield all([
    yield takeEvery(
      postMachine,
      handlePostMachine,
    ),
    yield takeLatest(
      getMachines,
      handleGetMachines,
    ),
    yield takeEvery(
      putMachine,
      handlePutMachines,
    ),
    yield takeLatest(
      executeMachinesAction,
      handleExecuteMachineAction,
    ),
    yield takeLatest(
      activateMachine,
      handleActivateMachine,
    ),
    yield takeLatest(
      reassignMachine,
      handleReassignMachine,
    ),
    yield takeLatest(
      exportMachines,
      handleExportMachines,
    ),
  ]);
}

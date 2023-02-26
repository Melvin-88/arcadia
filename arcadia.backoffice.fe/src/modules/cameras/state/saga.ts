import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import {
  convertDataToJSON, saveVideoFile, getDateTimeFormatted, saveStringAsFile,
} from 'arcadia-common-fe';
import {
  postCameraResetRequest,
  getCamerasRequest,
  getCameraStreamsRequest,
  postCameraRequest,
  removeCameraRequest,
  changeRecordingRequest,
  gerRecordingRequest,
  gerStreamAuthTokenRequest,
} from '../api';
import {
  exportCameras,
  getCameras,
  getCamerasError,
  getCamerasSuccess,
  exportCamerasError,
  exportCamerasSuccess,
  postCamera,
  mergeCamerasDialogForm,
  setCameraDialogForm,
  getCamerasStreams,
  getCamerasStreamsSuccess,
  getCamerasStreamsError,
  mergeCamerasWatch,
  executeCameraAction,
  setCameraDialogAction,
  mergeCameraDialogAction,
  getStreamsData,
  changeRecording,
  mergeChangeRecordingDialog,
  setChangeRecordingDialog,
  getRecording,
  mergeGetRecordingDialog,
  setGetRecordingDialog,
  getLiveWatchLink,
  mergeStreamDialog,
  setStreamDialog,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  ISelectedCamera,
  IGetCamerasRequestFiltersParams,
  IGetCamerasResponseBody,
  IGetCamerasStreamsRequest,
  IGetCamerasStreamsResponseBody,
  CameraAction,
} from '../types';
import { cameraStatusLabelMap } from '../constants';
import { setDialogJSONViewer } from '../../DialogJSONViewer/actions';

function* handleRefreshList() {
  yield put(getCameras(queryString.parse(window.location.search)));
}

function* handleGetCamerasRequest(requestParams: IGetCamerasRequestFiltersParams) {
  const { data } = yield call(getCamerasRequest, requestParams);

  return data;
}

function* handleGetCamerasStreamsRequest(requestParams: IGetCamerasStreamsRequest) {
  const { data } = yield call(getCameraStreamsRequest, requestParams);

  return data;
}

function* handlePostCamera({ payload }: ReturnType<typeof postCamera>) {
  try {
    yield put(mergeCamerasDialogForm({
      isLoading: true,
    }));

    yield call(postCameraRequest, payload);
    yield put(setCameraDialogForm());
    yield call(toast.success, `The camera ${payload.camera.id} has been successfully created`);
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeCamerasDialogForm({
      isLoading: false,
    }));
  }
}

function* handleGetCameras({ payload }: ReturnType<typeof getCameras>) {
  try {
    const camerasData: IGetCamerasResponseBody = yield handleGetCamerasRequest(payload);

    yield put(getCamerasSuccess(camerasData));
  } catch (error) {
    yield handleError(error);
    yield put(getCamerasError());
  }
}

function* handleGetLiveWatchLink({ payload }: ReturnType<typeof getLiveWatchLink>) {
  try {
    yield put(setStreamDialog({ ...payload, isOpen: true, isLoading: true }));

    const { data } = yield call(gerStreamAuthTokenRequest);

    yield put(mergeStreamDialog({
      isLoading: false,
      streamAuthToken: data.token,
    }));
  } catch (error) {
    yield handleError(error);
    yield put(mergeStreamDialog({ isLoading: false }));
  }
}

function* handleGetCamerasStreams({ payload }: ReturnType<typeof getCamerasStreams>) {
  try {
    yield put(mergeCamerasWatch({ isOpen: true, isLoading: true }));

    const { data } = yield call(gerStreamAuthTokenRequest);

    const response = yield all(
      payload.ids.map(({ id }: ISelectedCamera) => call(handleGetCamerasStreamsRequest, {
        site: payload.site,
        id,
      })),
    );

    yield put(getCamerasStreamsSuccess({
      streamAuthToken: data.token,
      streams: response.map(({ streams }: IGetCamerasStreamsResponseBody) => streams),
    }));
    yield put(mergeCamerasWatch({ isLoading: false }));
  } catch (error) {
    yield handleError(error);
    yield put(getCamerasStreamsError());
  }
}

function* handleGetStreamsData({ payload }: ReturnType<typeof getStreamsData>) {
  try {
    const { streams } = yield call(handleGetCamerasStreamsRequest, payload);

    yield put(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(streams),
    }));
  } catch (error) {
    yield handleError(error);
  }
}

function* handleExecuteCameraAction({ payload }: ReturnType<typeof executeCameraAction>) {
  try {
    const { id, action } = payload;

    yield put(mergeCameraDialogAction({ isLoading: true }));

    switch (action) {
      case CameraAction.remove:
        yield call(removeCameraRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully removed.`);
        break;
      case CameraAction.reset:
        yield call(postCameraResetRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully reset.`);
        break;
      default:
        break;
    }

    yield put(setCameraDialogAction());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeCameraDialogAction({ isLoading: false }));
  }
}

function* handleChangeRecording({ payload }: ReturnType<typeof changeRecording>) {
  try {
    yield put(mergeChangeRecordingDialog({ isLoading: true }));

    yield call(changeRecordingRequest, payload);
    yield put(setChangeRecordingDialog());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeChangeRecordingDialog({ isLoading: false }));
  }
}

function* handleGetRecording({ payload }: ReturnType<typeof getRecording>) {
  try {
    yield put(mergeGetRecordingDialog({ isLoading: true }));

    const { data } = yield call(gerRecordingRequest, payload);

    yield call(
      saveVideoFile,
      data,
      `${getDateTimeFormatted(payload.fromDateTime)}-${getDateTimeFormatted(payload.toDateTime)}-camera-${payload.id}.mp4`,
    );
    yield put(setGetRecordingDialog());
  } catch (error) {
    yield handleError(error);
    yield put(mergeGetRecordingDialog({ isLoading: false }));
  }
}

function* handleExportCameras({ payload }: ReturnType<typeof exportCameras>) {
  try {
    const { cameras }: IGetCamerasResponseBody = yield handleGetCamerasRequest(payload);

    const preparedData = cameras.map((camera) => ({
      'Stream Status': cameraStatusLabelMap[camera.status],
      'Camera ID': camera.id,
      Site: camera.site,
      'Recording status': camera.isRecorded ? 'Online' : 'Offline',
      Type: camera.type,
      'Camera IP': camera.ip,
      Machine: camera.machine,
      'Live watch link': camera.liveStreamUrl,
      'Console Url': camera.consoleUrl,
      'Admin username': camera.adminUser,
      'Admin password': camera.adminPassword,
      'Admin URL': camera.adminUrl,
      Comments: camera.comments,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'cameras.csv');
    yield put(exportCamerasSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportCamerasError());
  }
}

export function* camerasSagas() {
  yield all([
    yield takeEvery(
      postCamera,
      handlePostCamera,
    ),
    yield takeLatest(
      getCameras,
      handleGetCameras,
    ),
    yield takeLatest(
      getLiveWatchLink,
      handleGetLiveWatchLink,
    ),
    yield takeLatest(
      getCamerasStreams,
      handleGetCamerasStreams,
    ),
    yield takeLatest(
      getStreamsData,
      handleGetStreamsData,
    ),
    yield takeLatest(
      executeCameraAction,
      handleExecuteCameraAction,
    ),
    yield takeLatest(
      changeRecording,
      handleChangeRecording,
    ),
    yield takeLatest(
      getRecording,
      handleGetRecording,
    ),
    yield takeLatest(
      exportCameras,
      handleExportCameras,
    ),
  ]);
}

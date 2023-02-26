import { createAction } from '@reduxjs/toolkit';
import {
  ICameraDialogFormState,
  ICamerasDialogWatchState,
  ISelectedCamera,
  IGetCamerasRequestFiltersParams,
  IGetCamerasResponseBody,
  IPostCameraRequestBody,
  ICameraDialogStreamState,
  ICameraDialogActionState,
  ICameraActionRequestBody,
  CameraAction,
  IGetCamerasStreams,
  IGetStreamsData,
  ICameraDialogChangeRecordingState,
  IChangeRecordingRequestBody,
  ICameraDialogGetRecordingState,
  IGetRecordingRequestBody,
  IGetCamerasStreamsSuccess,
  IGetCameraStream,
} from '../types';

interface IExecuteActionPayload extends ICameraActionRequestBody {
  action: CameraAction
}

export const clearCameras = createAction('CAMERAS/CLEAR_CAMERAS');

export const postCamera = createAction<IPostCameraRequestBody>('CAMERAS/POST_CAMERA');

export const getCameras = createAction<IGetCamerasRequestFiltersParams>('CAMERAS/GET_CAMERAS');
export const getCamerasSuccess = createAction<IGetCamerasResponseBody>('CAMERAS/GET_CAMERAS/SUCCESS');
export const getCamerasError = createAction('CAMERAS/GET_CAMERAS/ERROR');

export const exportCameras = createAction<IGetCamerasRequestFiltersParams>('CAMERAS/EXPORT');
export const exportCamerasSuccess = createAction('CAMERAS/EXPORT/SUCCESS');
export const exportCamerasError = createAction('CAMERAS/EXPORT/ERROR');

export const setCameraDialogForm = createAction<Partial<ICameraDialogFormState> | undefined>('CAMERAS/SET_DIALOG_FORM');
export const mergeCamerasDialogForm = createAction<Partial<ICameraDialogFormState> | undefined>('CAMERAS/MERGE_DIALOG_FORM');

export const getCamerasStreams = createAction<IGetCamerasStreams>('CAMERAS/GET_CAMERAS_STREAMS');
export const getCamerasStreamsSuccess = createAction<IGetCamerasStreamsSuccess>('CAMERAS/GET_CAMERAS_STREAMS/SUCCESS');
export const getCamerasStreamsError = createAction('CAMERAS/GET_CAMERAS_STREAMS/ERROR');

export const selectCamera = createAction<ISelectedCamera>('CAMERAS/CAMERA_SELECT');

export const getStreamsData = createAction<IGetStreamsData>('CAMERAS/GET_STREAMS_DATA');

export const setCamerasWatch = createAction<Partial<ICamerasDialogWatchState> | undefined>('CAMERAS/SET_DIALOG_WATCH');
export const mergeCamerasWatch = createAction<Partial<ICamerasDialogWatchState> | undefined>('CAMERAS/MERGE_DIALOG_WATCH');

export const getLiveWatchLink = createAction<IGetCameraStream>('CAMERAS/GET_CAMERA_STREAM');
export const setStreamDialog = createAction<Partial<ICameraDialogStreamState> | undefined>('CAMERAS/SET_STREAM_DIALOG');
export const mergeStreamDialog = createAction<Partial<ICameraDialogStreamState> | undefined>('CAMERAS/MERGE_STREAM_DIALOG');

export const setChangeRecordingDialog = createAction<Partial<ICameraDialogChangeRecordingState> | undefined>(
  'CAMERAS/SET_CHANGE_RECORDING_DIALOG',
);
export const mergeChangeRecordingDialog = createAction<Partial<ICameraDialogChangeRecordingState> | undefined>(
  'CAMERAS/MERGE_CHANGE_RECORDING_DIALOG',
);
export const changeRecording = createAction<IChangeRecordingRequestBody>('CAMERAS/CHANGE_RECORDING');

export const setGetRecordingDialog = createAction<Partial<ICameraDialogGetRecordingState> | undefined>(
  'CAMERAS/SET_GET_RECORDING_DIALOG',
);
export const mergeGetRecordingDialog = createAction<Partial<ICameraDialogGetRecordingState> | undefined>(
  'CAMERAS/MERGE_GET_RECORDING_DIALOG',
);
export const getRecording = createAction<IGetRecordingRequestBody>('CAMERAS/GET_RECORDING');

export const setCameraDialogAction = createAction<Partial<ICameraDialogActionState> | undefined>('CAMERAS/SET_DIALOG_ACTION');
export const mergeCameraDialogAction = createAction<Partial<ICameraDialogActionState> | undefined>('CAMERAS/MERGE_DIALOG_ACTION');
export const executeCameraAction = createAction<IExecuteActionPayload>('CAMERAS/EXECUTE_ACTION');

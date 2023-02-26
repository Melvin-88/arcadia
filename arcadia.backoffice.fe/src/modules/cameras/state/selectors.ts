import { ICamerasSlice } from '../types';

export const camerasReducerSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer;

export const camerasDialogFormSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogForm;

export const camerasDialogWatchSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogWatch;

export const camerasDialogStreamSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogStream;

export const cameraDialogActionSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogAction;

export const camerasDialogChangeRecordingSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogChangeRecording;

export const camerasDialogGetRecordingSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.dialogGetRecording;

export const selectedCamerasSelector = ({ camerasReducer }: ICamerasSlice) => camerasReducer.selectedCameras;

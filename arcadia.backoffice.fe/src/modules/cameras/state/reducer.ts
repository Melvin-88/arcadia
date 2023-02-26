import { createReducer } from '@reduxjs/toolkit';
import { CameraAction, ICamerasReducer } from '../types';

import {
  getCameras,
  getCamerasSuccess,
  getCamerasError,
  mergeCamerasDialogForm,
  setCameraDialogForm,
  setCamerasWatch,
  mergeCamerasWatch,
  getCamerasStreamsSuccess,
  getCamerasStreamsError,
  setStreamDialog,
  mergeStreamDialog,
  selectCamera,
  setCameraDialogAction,
  mergeCameraDialogAction,
  clearCameras,
  setChangeRecordingDialog,
  mergeChangeRecordingDialog,
  setGetRecordingDialog,
  mergeGetRecordingDialog,
} from './actions';
import { CAMERAS_ON_DISPLAY } from '../constants';

export const initialState: ICamerasReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  cameras: [],
  selectedCameras: [],
  dialogForm: {
    isOpen: false,
    isLoading: false,
  },
  dialogWatch: {
    isOpen: false,
    isLoading: false,
    streamAuthToken: '',
    streams: [],
  },
  dialogStream: {
    isOpen: false,
    isLoading: false,
    camera: null,
    streamAuthToken: '',
  },
  dialogAction: {
    id: '',
    action: CameraAction.remove,
    isOpen: false,
    isLoading: false,
  },
  dialogChangeRecording: {
    id: '',
    isOpen: false,
    isRecorded: false,
    isLoading: false,
  },
  dialogGetRecording: {
    id: '',
    isOpen: false,
    isLoading: false,
  },
};

export const camerasReducer = createReducer(initialState, (builder) => {
  builder.addCase(clearCameras, () => ({
    ...initialState,
  }));

  builder.addCase(selectCamera, (state, { payload }) => {
    let newSelectedState = [...state.selectedCameras];

    if (newSelectedState.some((item) => item.id === payload.id)) {
      newSelectedState = newSelectedState.filter((item) => item.id !== payload.id);
    } else if (newSelectedState.length < CAMERAS_ON_DISPLAY) {
      newSelectedState.push(payload);
    }

    return ({
      ...state,
      selectedCameras: newSelectedState,
    });
  });

  builder.addCase(getCameras, (state) => ({
    ...state,
    total: 0,
    cameras: [],
    selectedCameras: [],
    isLoading: true,
  }));
  builder.addCase(getCamerasSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getCamerasError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(setCameraDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeCamerasDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setCamerasWatch, (state, { payload }) => ({
    ...state,
    dialogWatch: {
      ...initialState.dialogWatch,
      ...payload,
    },
  }));
  builder.addCase(mergeCamerasWatch, (state, { payload }) => ({
    ...state,
    dialogWatch: {
      ...state.dialogWatch,
      ...payload,
    },
  }));
  builder.addCase(getCamerasStreamsSuccess, (state, { payload }) => ({
    ...state,
    dialogWatch: {
      ...state.dialogWatch,
      ...payload,
    },
  }));
  builder.addCase(getCamerasStreamsError, (state) => ({
    ...state,
    dialogWatch: {
      ...state.dialogWatch,
      isLoading: false,
    },
  }));

  builder.addCase(setStreamDialog, (state, { payload }) => ({
    ...state,
    dialogStream: {
      ...initialState.dialogStream,
      ...payload,
    },
  }));
  builder.addCase(mergeStreamDialog, (state, { payload }) => ({
    ...state,
    dialogStream: {
      ...state.dialogStream,
      ...payload,
    },
  }));

  builder.addCase(setChangeRecordingDialog, (state, { payload }) => ({
    ...state,
    dialogChangeRecording: {
      ...initialState.dialogChangeRecording,
      ...payload,
    },
  }));
  builder.addCase(mergeChangeRecordingDialog, (state, { payload }) => ({
    ...state,
    dialogChangeRecording: {
      ...state.dialogChangeRecording,
      ...payload,
    },
  }));

  builder.addCase(setGetRecordingDialog, (state, { payload }) => ({
    ...state,
    dialogGetRecording: {
      ...initialState.dialogGetRecording,
      ...payload,
    },
  }));
  builder.addCase(mergeGetRecordingDialog, (state, { payload }) => ({
    ...state,
    dialogGetRecording: {
      ...state.dialogGetRecording,
      ...payload,
    },
  }));

  builder.addCase(setCameraDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeCameraDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));
});

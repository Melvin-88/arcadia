import { createReducer } from '@reduxjs/toolkit';
import { IAppReducer } from './types';
import {
  mergeSoundsConfig,
  setAppLoader,
  setHomeUrl,
  setIsLostConnection,
  setQueueToken,
  setQuitConfirmDialog,
  setResult,
  setRounds,
  setRoundsBuyLimit,
  setSession,
  setSessionStatus,
  setShortestQueueProposal,
} from './actions';
import {
  pubSubConnectAndLogin,
  pubSubConnectAndLoginError,
  pubSubConnectAndLoginSuccess,
  pubSubRestoreConnection,
} from '../../services/pubSubClient/actions';
import { SessionStatus } from '../../types/session';
import { SessionStorageKeys } from '../../constants';
import { GroupColorId } from '../../types/group';

// TODO: Review and refactor after first priority tasks

export const initialState: IAppReducer = {
  isPubSubConnected: false,
  appLoader: {
    message: null,
    isLoading: false,
  },
  session: {
    sessionId: '',
    playerId: '',
    currency: 'USD',
    rounds: 0,
    machineId: 0,
    stackSize: 0,
    betInCash: 0,
    stackBuyLimit: 0,
    idleTimeoutSec: 0,
    graceTimeoutSec: 0,
    phantomWidgetAnimationDurationMS: 0,
    groupName: '',
    streamAuthToken: '',
    videoServiceEnv: '',
    sessionStatus: sessionStorage.getItem(SessionStorageKeys.sessionStatus) as SessionStatus ?? SessionStatus.viewer,
    video: {
      serverUrl: '',
      lowQualityRTSP: '',
      highQualityRTSP: '',
      hlsUrlHighQuality: '',
    },
    payTable: [],
    wheel: [],
    slotConfig: [],
    scatterType: null,
    groupColor: GroupColorId.purple,
  },
  soundsConfig: {
    isAllSoundsMuted: false,
    isMachineSoundsMuted: false,
    isGameSoundsMuted: false,
    machineSoundsVolume: 100,
    gameSoundsVolume: 1,
  },
  resultDialog: {
    isOpen: false,
    totalWin: 0,
    currency: 'USD', // TODO: review after demo
    duration: 0,
  },
  shortestQueueProposal: null,
  quitConfirmDialog: {
    isOpen: false,
  },
  isLostConnection: false,
  homeUrl: sessionStorage.getItem(SessionStorageKeys.homeUrl) || null,
};

export const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAppLoader, (state, { payload }) => ({
    ...state,
    appLoader: {
      ...initialState.appLoader,
      ...payload,
    },
  }));

  builder.addCase(pubSubConnectAndLogin, (state) => ({
    ...state,
    isPubSubConnected: false,
  }));
  builder.addCase(pubSubConnectAndLoginSuccess, (state) => ({
    ...state,
    isPubSubConnected: true,
  }));
  builder.addCase(pubSubConnectAndLoginError, (state) => ({
    ...state,
    isPubSubConnected: false,
  }));
  builder.addCase(pubSubRestoreConnection, (state) => ({
    ...state,
    isPubSubConnected: false,
  }));

  builder.addCase(mergeSoundsConfig, (state, { payload }) => ({
    ...state,
    soundsConfig: {
      ...state.soundsConfig,
      ...payload,
    },
  }));

  builder.addCase(setSession, (state, { payload }) => ({
    ...state,
    session: {
      ...initialState.session,
      ...payload.session,
    },
  }));
  builder.addCase(setSessionStatus, (state, { payload }) => ({
    ...state,
    session: {
      ...state.session,
      sessionStatus: payload.status,
    },
  }));

  builder.addCase(setQueueToken, (state, { payload }) => ({
    ...state,
    ...payload,
  }));

  builder.addCase(setRounds, (state, { payload }) => ({
    ...state,
    session: {
      ...state.session,
      rounds: payload.rounds,
    },
  }));
  builder.addCase(setRoundsBuyLimit, (state, { payload }) => ({
    ...state,
    session: {
      ...state.session,
      stackBuyLimit: payload.stackBuyLimit,
    },
  }));
  builder.addCase(setShortestQueueProposal, (state, { payload }) => ({
    ...state,
    shortestQueueProposal: payload,
  }));
  builder.addCase(setResult, (state, { payload }) => ({
    ...state,
    resultDialog: {
      ...initialState.resultDialog,
      ...payload,
    },
  }));

  builder.addCase(setQuitConfirmDialog, (state, { payload }) => ({
    ...state,
    quitConfirmDialog: payload,
  }));

  builder.addCase(setIsLostConnection, (state, { payload }) => ({
    ...state,
    isLostConnection: payload.isLostConnection,
  }));

  builder.addCase(setHomeUrl, (state, { payload }) => ({
    ...state,
    homeUrl: payload.homeUrl,
  }));
});

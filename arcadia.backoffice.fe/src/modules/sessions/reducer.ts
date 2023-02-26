import { createReducer } from '@reduxjs/toolkit';
import { ITEMS_PER_PAGE } from 'arcadia-common-fe';
import { ISessionsReducer } from './types';
import {
  getSessions,
  getSessionsSuccess,
  getSessionsError,
  exportSessions,
  exportSessionsSuccess,
  exportSessionsError,
  openTerminateDialog,
  closeTerminateDialog,
  terminateSession,
  terminateSessionSuccess,
  terminateSessionError,
  getLogs,
  getLogsSuccess,
  getLogsError,
  setSessionLogsDialog,
  mergeSessionLogsDialog,
} from './actions';

export const initialState: ISessionsReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  sessions: [],
  dialogLogs: {
    session: null,
    isOpen: false,
    isLoading: false,
    isExporting: false,
    total: 0,
    logs: [],
    filterParams: {
      take: ITEMS_PER_PAGE,
    },
  },
  dialogTerminate: {
    isOpen: false,
    isLoading: false,
    id: null,
  },
};

export const sessionsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getSessions, (state) => ({
    ...state,
    total: 0,
    sessions: [],
    isLoading: true,
  }));
  builder.addCase(getSessionsSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getSessionsError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(exportSessions, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportSessionsSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportSessionsError, (state) => ({
    ...state,
    isExporting: false,
  }));

  builder.addCase(getLogs, (state, { payload }) => ({
    ...state,
    dialogLogs: {
      ...state.dialogLogs,
      ...payload,
      isOpen: true,
      isLoading: true,
    },
  }));
  builder.addCase(getLogsSuccess, (state, { payload }) => ({
    ...state,
    dialogLogs: {
      ...state.dialogLogs,
      ...payload,
      isLoading: false,
    },
  }));
  builder.addCase(getLogsError, (state) => ({
    ...state,
    dialogLogs: {
      ...state.dialogLogs,
      isLoading: false,
    },
  }));

  builder.addCase(setSessionLogsDialog, (state, { payload }) => ({
    ...state,
    dialogLogs: {
      ...initialState.dialogLogs,
      ...payload,
    },
  }));
  builder.addCase(mergeSessionLogsDialog, (state, { payload }) => ({
    ...state,
    dialogLogs: {
      ...state.dialogLogs,
      ...payload,
    },
  }));

  builder.addCase(openTerminateDialog, (state, { payload }) => ({
    ...state,
    dialogTerminate: {
      isOpen: true,
      id: payload.id,
    },
  }));
  builder.addCase(closeTerminateDialog, (state) => ({
    ...state,
    dialogTerminate: { ...initialState.dialogTerminate },
  }));
  builder.addCase(terminateSession, (state) => ({
    ...state,
    dialogTerminate: {
      ...state.dialogTerminate,
      isLoading: true,
    },
  }));

  builder.addCase(terminateSessionSuccess, (state) => ({
    ...state,
    dialogTerminate: { ...initialState.dialogTerminate },
  }));
  builder.addCase(terminateSessionError, (state) => ({
    ...state,
    dialogTerminate: {
      ...state.dialogTerminate,
      isLoading: false,
    },
  }));
});

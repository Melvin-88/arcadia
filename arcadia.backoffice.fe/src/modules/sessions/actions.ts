import { createAction } from '@reduxjs/toolkit';
import {
  IGetSessionsRequestFiltersParams,
  IGetSessionsResponseBody,
  ITerminateSessionRequestBody,
  IOpenTerminateDialog,
  IGetSessionLogsRequestBody,
  IGetSessionLogsResponseBody,
  ISessionLogsDialog,
  IExportSessionLogsRequestBody,
} from './types';

export const getSessions = createAction<IGetSessionsRequestFiltersParams>('SESSIONS/GET_SESSIONS');
export const getSessionsSuccess = createAction<IGetSessionsResponseBody>('SESSIONS/GET_SESSIONS/SUCCESS');
export const getSessionsError = createAction('SESSIONS/GET_SESSIONS/ERROR');

export const exportSessions = createAction<IGetSessionsRequestFiltersParams>('SESSIONS/EXPORT');
export const exportSessionsSuccess = createAction('SESSIONS/EXPORT/SUCCESS');
export const exportSessionsError = createAction('SESSIONS/EXPORT/ERROR');

export const setSessionLogsDialog = createAction<Partial<ISessionLogsDialog> | undefined>('SESSIONS/SET_LOGS_DIALOG');
export const mergeSessionLogsDialog = createAction<Partial<ISessionLogsDialog> | undefined>('SESSIONS/MERGE_LOGS_DIALOG');

export const getLogs = createAction<IGetSessionLogsRequestBody>('SESSIONS/GET_LOGS');
export const getLogsSuccess = createAction<IGetSessionLogsResponseBody>('SESSIONS/GET_LOGS/SUCCESS');
export const getLogsError = createAction('SESSIONS/GET_LOGS/ERROR');

export const exportSessionLogs = createAction<IExportSessionLogsRequestBody>('SESSIONS/EXPORT_LOGS');
export const exportSessionLogsSuccess = createAction('SESSIONS/EXPORT_LOGS/SUCCESS');
export const exportSessionLogsError = createAction('SESSIONS/EXPORT_LOGS/ERROR');

export const openTerminateDialog = createAction<IOpenTerminateDialog>('SESSIONS/TERMINATE_SESSION/OPEN_DIALOG');
export const closeTerminateDialog = createAction('SESSIONS/TERMINATE_SESSION/CLOSE_DIALOG');
export const terminateSession = createAction<ITerminateSessionRequestBody>('SESSIONS/TERMINATE_SESSION');
export const terminateSessionSuccess = createAction('SESSIONS/TERMINATE_SESSION/SUCCESS');
export const terminateSessionError = createAction('SESSIONS/TERMINATE_SESSION/ERROR');

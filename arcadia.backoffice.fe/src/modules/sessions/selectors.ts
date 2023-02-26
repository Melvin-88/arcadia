import { ISessionsSlice } from './types';

export const sessionsReducerSelector = ({ sessionsReducer }: ISessionsSlice) => sessionsReducer;

export const sessionDialogLogsSelector = ({ sessionsReducer }: ISessionsSlice) => sessionsReducer.dialogLogs;

export const sessionDialogTerminateSelector = ({ sessionsReducer }: ISessionsSlice) => sessionsReducer.dialogTerminate;

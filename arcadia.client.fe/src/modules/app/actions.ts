import { createAction } from '@reduxjs/toolkit';
import {
  IAppLoader, IResultDialog, IShortestQueueProposal, ISoundsConfig, IQuitConfirmDialog, IChangeOrientationData,
} from './types';
import { ISession, SessionStatus } from '../../types/session';
import { INotification } from '../../types/notification';
import { QuitReason } from '../../types/general';

export const setAppLoader = createAction<Partial<IAppLoader> | undefined>('APP/APP_LOADER_SET');

export const setSession = createAction<{ session: ISession }>('APP/SET_SESSION');

export const setSessionStatus = createAction<{ status: SessionStatus }>('APP/SET_SESSION_STATUS');

export const setResult = createAction<IResultDialog | undefined>('APP/SET_RESULT');

export const mergeSoundsConfig = createAction<Partial<ISoundsConfig>>('APP/MERGE_SOUNDS_CONFIG');

export const setQueueToken = createAction<{ queueToken: string }>('APP/SET_QUEUE_TOKEN');

export const setRounds = createAction<{ rounds: number }>('APP/SET_ROUNDS');

export const setRoundsBuyLimit = createAction<{ stackBuyLimit: number }>('APP/SET_ROUNDS_BUY_LIMIT');

export const setShortestQueueProposal = createAction<IShortestQueueProposal | null>('APP/SET_SHORTEST_QUEUE_PROPOSAL');

export const useShortestQueueProposal = createAction('APP/USE_SHORTEST_QUEUE_PROPOSAL');

export const initUserInMachine = createAction('APP/INIT_USER_IN_MACHINE');

export const restoreConnection = createAction('APP/RESTORE_CONNECTION');

export const setIsLostConnection = createAction<{ isLostConnection: boolean }>('APP/SET_IS_LOST_CONNECTION');

export const setQuitConfirmDialog = createAction<IQuitConfirmDialog>('APP/SET_QUIT_CONFIRM_DIALOG');

export const quit = createAction<{reason: QuitReason}>('APP/QUIT');

export const notification = createAction<INotification>('APP/NOTIFICATION');

export const forceGoToLobby = createAction('APP/FORCE_GO_TO_LOBBY');

export const changeOrientation = createAction<IChangeOrientationData>('APP/CHANGE_ORIENTATION');

export const goToTheOperatorLobby = createAction('APP/GO_TO_THE_OPERATOR_LOBBY');

export const setHomeUrl = createAction<{ homeUrl: string }>('APP/SET_HOME_URL');

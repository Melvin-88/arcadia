import { createAction } from '@reduxjs/toolkit';
import { IPubSubConnectData, IPubSubLoginEmitData, IPubSubRestoreConnectionData } from './types';

export const pubSubConnectAndLogin = createAction<IPubSubConnectData & IPubSubLoginEmitData>('APP/PUB_SUB_CONNECT_AND_LOGIN');
export const pubSubConnectAndLoginSuccess = createAction('APP/PUB_SUB_CONNECT_AND_LOGIN/SUCCESS');
export const pubSubConnectAndLoginError = createAction('APP/PUB_SUB_CONNECT_AND_LOGIN/ERROR');

export const pubSubRestoreConnection = createAction<IPubSubRestoreConnectionData>('APP/PUB_SUB_RESTORE_CONNECTION');

export const pubSubForceDisconnect = createAction('APP/PUB_SUB_FORCE_DISCONNECT');

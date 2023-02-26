import { createAction } from '@reduxjs/toolkit';
import { IGetLobbyDataRequestQueryParams, IGetLobbyDataResponseBody } from '../types';

export const getLobbyData = createAction<IGetLobbyDataRequestQueryParams>('LOBBY/GET_LOBBY_DATA');
export const getLobbyDataSuccess = createAction<IGetLobbyDataResponseBody>('LOBBY/GET_LOBBY_DATA/SUCCESS');
export const getLobbyDataError = createAction('LOBBY/GET_LOBBY_DATA/ERROR');

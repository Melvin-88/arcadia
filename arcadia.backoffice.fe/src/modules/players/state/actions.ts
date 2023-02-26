import { createAction } from '@reduxjs/toolkit';
import {
  IDialogActionState,
  IGetPlayersRequestFilterParams,
  IGetPlayersResponseBody,
  IPlayerActionRequestBody,
  PlayerAction,
} from '../types';

interface IExecuteActionPayload extends IPlayerActionRequestBody {
  action: PlayerAction
}

export const getPlayers = createAction<IGetPlayersRequestFilterParams>('PLAYERS/GET_PLAYERS');
export const getPlayersSuccess = createAction<IGetPlayersResponseBody>('PLAYERS/GET_PLAYERS/SUCCESS');
export const getPlayersError = createAction('PLAYERS/GET_PLAYERS/ERROR');

export const setPlayersDialogAction = createAction<Partial<IDialogActionState> | undefined>('PLAYERS/SET_DIALOG_ACTION');
export const mergePlayersDialogAction = createAction<Partial<IDialogActionState> | undefined>('PLAYERS/MERGE_DIALOG_ACTION');
export const executePlayersAction = createAction<IExecuteActionPayload>('PLAYERS/EXECUTE_ACTION');

export const exportPlayers = createAction<IGetPlayersRequestFilterParams>('PLAYERS/EXPORT');
export const exportPlayersSuccess = createAction('PLAYERS/EXPORT/SUCCESS');
export const exportPlayersError = createAction('PLAYERS/EXPORT/ERROR');

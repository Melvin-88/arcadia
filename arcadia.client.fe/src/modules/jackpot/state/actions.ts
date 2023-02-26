import { createAction } from '@reduxjs/toolkit';
import {
  GameId, IJackpotPotState, IJackpotSetupData, IJackpotWinData,
} from '../types';
import { PlayerId } from '../../../types/session';
import { IBlueRibbonWinningDetails } from '../services/types';

export const setupJackpot = createAction<IJackpotSetupData>('JACKPOT/SETUP');

export const setJackpotActiveGameId = createAction<{ gameId: GameId }>('JACKPOT/SET_JACKPOT_ACTIVE_GAME_ID');

export const setJackpotIsActive = createAction<{ isActive: boolean }>('JACKPOT/SET_JACKPOT_IS_ACTIVE');

export const setJackpotIsOptInEnabled = createAction<{ gameId: GameId; isOptInEnabled: boolean; withoutUpdateRequest?: boolean }>(
  'JACKPOT/SET_JACKPOT_IS_OPT_IN_ENABLED',
);

export const setJackpotPotState = createAction<{ gameId: GameId; potState: IJackpotPotState }>('JACKPOT/SET_POT_STATE');

export const setJackpotWinData = createAction <IJackpotWinData | null>('JACKPOT/SET_WIN_DATA');

export const processBlueRibbonPlayerOptEvent = createAction<{
  gameId: GameId;
  playerId: PlayerId;
  isOptInEnabled: boolean;
}>('JACKPOT/PROCESS_BLUE_RIBBON_PLAYER_OPT_EVENT');

export const processBlueRibbonWinEvent = createAction<{ winningDetails: IBlueRibbonWinningDetails }>(
  'JACKPOT/PROCESS_BLUE_RIBBON_WIN_EVENT',
);

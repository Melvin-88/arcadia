// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { IBlueRibbonJackpotPotState, IBlueRibbonSetupData, IBlueRibbonWinningDetails } from './services/types';

export type GameId = string;

export interface IJackpotSetupData extends IBlueRibbonSetupData {
  activeGameId?: GameId;
}

export interface IJackpotPotState extends Omit<IBlueRibbonJackpotPotState, 'progressive'> {
  valueInCash: number;
}
export type IJackpotPotStatesMap = {
  [key in GameId]: IJackpotPotState
};

export interface IJackpotWinData extends IBlueRibbonWinningDetails {
}

export interface IJackpotReducer {
  activeGameId: string;
  isActive: boolean;
  isOptInEnabled: boolean;
  potStatesMap: IJackpotPotStatesMap;
  winData: null | IJackpotWinData;
}

export interface IJackpotReducerStoreSlice {
  jackpotReducer: IJackpotReducer;
}

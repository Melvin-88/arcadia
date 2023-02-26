// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { GameId } from '../types';

export interface IPostLoginAnonymousRequestBody {
  token: string;
}

export interface IPostLoginPlayerRequestBody {
  token: string;
}

export interface IBlueRibbonConnectConfiguration {
  playerId: string;
  currency: string;
}

export interface IBlueRibbonSetupData extends IBlueRibbonConnectConfiguration {
  operatorId: string;
  baseServiceUrl: string;
}

export interface IBlueRibbonGame {
  gameId: GameId;
}

interface IBlueRibbonPlayerOptState {
  gameId: GameId;
  playerId: string;
  gameName: string;
}

export interface IBlueRibbonJackpotPotState {
  gameId: GameId;
  currency: string;
  potId: string;
  progressive: number;
  updateTimestamp: number;
}

export interface IBlueRibbonConnectionActivityChangedEventPayload {
  connectionDetails: {
    isActive: boolean;
  };
}

export interface IBlueRibbonPotStateChangedEventPayload {
  jackpotPotState: IBlueRibbonJackpotPotState;
}

export interface IBlueRibbonWinningDetails {
  gameId: GameId;
  playerId: string;
  potId: string;
  currency: string;
  amount: number;
  seedPotAmount: number;
  updateTimestamp: number;
}

export interface IBlueRibbonWinEventPayload {
  winningDetails: IBlueRibbonWinningDetails;
}

export interface IBlueRibbonOptInEventPayload {
  playerOptState: IBlueRibbonPlayerOptState;
}

export interface IBlueRibbonOptOutEventPayload {
  playerOptState: IBlueRibbonPlayerOptState;
}

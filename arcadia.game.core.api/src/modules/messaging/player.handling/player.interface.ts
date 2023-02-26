export interface PlayerWinMessage {
  type: string;
  currencyValue: number;
  soundId: string;
  iconId: string;
}

export interface PlayerTotalWinMessage {
  totalWin: number;
}

export interface PlayerSessionResultMessage {
  totalWin: number;
  currency: string;
  duration: number;
}

export interface PlayerRebuyMessage {
  roundsAllowed: number;
}

export interface PlayerBalanceMessage {
  valueInCash: number;
}

export interface PhantomMessage {
  value: number;
}

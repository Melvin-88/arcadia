export enum BetBehindStatus {
  pendingStart = 'pendingStart',
  playing = 'pending',
  pendingEnd = 'pendingEnd',
}

export interface IBetBehindConfig {
  stopAfterRounds: number;
  singleWinThreshold: number;
  stopIfJackpot: boolean;
  lowLimitMultiplier: number;
  hiLimitMultiplier: number;
}

export enum TiltMode {
  auto = 'auto',
  manual = 'manual',
}

export interface IAutoplayConfig {
  stopAfterRounds: number;
  singleWinThreshold: number;
  stopIfJackpot: boolean;
  tiltMode: TiltMode;
  lowLimitMultiplier: number;
  hiLimitMultiplier: number;
}

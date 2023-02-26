import { TiltMode } from '../enums';

export class AutoplayConfiguration {
  tiltMode: TiltMode;
  stopIfJackpot: boolean;
  stopAfterRounds: number;
  hiLimitMultiplier: number;
  lowLimitMultiplier: number;
  singleWinThreshold: number;
}

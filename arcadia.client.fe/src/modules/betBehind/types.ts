import { BetBehindStatus, IBetBehindConfig } from '../../types/betBehind';

export interface IBetBehindReducer {
  isSnackbarOpen: boolean;
  betBehindStatus: BetBehindStatus;
  config: IBetBehindConfig;
}

export interface IBetBehindReducerSlice {
  betBehindReducer: IBetBehindReducer;
}

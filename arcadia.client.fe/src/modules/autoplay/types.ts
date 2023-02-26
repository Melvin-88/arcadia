import { IAutoplayConfig } from '../../types/autoplay';

export interface IAutoplayReducer {
  isSnackbarOpen: boolean;
  isEnabled: boolean;
  config: IAutoplayConfig;
}

export interface IAutoplayReducerSlice {
  autoplayReducer: IAutoplayReducer;
}

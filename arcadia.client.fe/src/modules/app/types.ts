// TODO: Review and refactor after first priority tasks
import { ISession } from '../../types/session';
import { Orientation } from '../../types/general';

export interface IAppLoader {
  message: null | string;
  isLoading: boolean;
}

export interface ISoundsConfig {
  isAllSoundsMuted: boolean;
  isMachineSoundsMuted: boolean;
  isGameSoundsMuted: boolean;
  machineSoundsVolume: number;
  gameSoundsVolume: number;
}

export interface IResultDialog {
  isOpen: boolean;
  totalWin: number;
  currency: string;
  duration: number;
}

export interface IShortestQueueProposal {
  machineId: number;
  machineName: string;
  queuePosition: number;
}

export interface IQuitConfirmDialog {
  isOpen: boolean;
}

export interface IAppReducer {
  readonly appLoader: IAppLoader;
  readonly isPubSubConnected: boolean;
  readonly queueToken?: string;
  readonly session: ISession;
  readonly soundsConfig: ISoundsConfig;
  readonly resultDialog: IResultDialog;
  readonly isLostConnection: boolean;
  readonly shortestQueueProposal: IShortestQueueProposal | null;
  readonly quitConfirmDialog: IQuitConfirmDialog;
  readonly homeUrl: string | null;
}

export interface IAppStoreSlice {
  appReducer: IAppReducer;
}

export interface IChangeOrientationData {
  orientation: Orientation;
}

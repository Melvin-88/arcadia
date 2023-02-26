import { IChip } from '../../types/chip';
import { IActiveRound } from '../../types/round';

export interface IChipWinQueueItem extends IChip {
  id: string;
}

export type IChipWinQueue = IChipWinQueueItem[];

export type PhantomChipWinId = string;

export interface IPhantomChipWin {
  id: PhantomChipWinId;
  value: number;
  isSubtractedFromTotalWin: boolean;
}

export type IPhantomChipWinQueue = IPhantomChipWin[];

export interface ICancelStacksDialog {
  isOpen: boolean;
}

export interface IGameReducer {
  readonly activeRound: IActiveRound | null;
  readonly idleTimeoutStartTimestamp: number | null;
  readonly coins: number;
  readonly balance: number;
  readonly totalWin: number;
  readonly isDetectingDroppedChips: boolean;
  readonly chipWinQueue: IChipWinQueue;
  readonly phantomChipWinQueue: IPhantomChipWinQueue;
  readonly cancelStacksDialog: ICancelStacksDialog;
}

export interface IGameReducerStoreSlice {
  gameReducer: IGameReducer;
}

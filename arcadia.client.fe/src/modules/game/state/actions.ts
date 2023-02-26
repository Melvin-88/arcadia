import { createAction } from '@reduxjs/toolkit';
import {
  IChipWinQueueItem, IPhantomChipWin, PhantomChipWinId, ICancelStacksDialog,
} from '../types';
import { IActiveRound, RoundType } from '../../../types/round';

export const fire = createAction('GAME/FIRE');
export const fireStop = createAction('GAME/FIRE_STOP');

export const sendRailPosition = createAction<{ railPosition: number }>('GAME/RAIL/SEND_POSITION');

export const setIdleTimeoutStartTimestamp = createAction<{ timestamp: number | null }>('GAME/SET_IDLE_TIMEOUT_START_TIMESTAMP');

export const roundStart = createAction<{ type: RoundType }>('GAME/ROUND_START');

export const setActiveRound = createAction<{ activeRound: IActiveRound | null }>('GAME/SET_ACTIVE_ROUND');

export const setCoins = createAction<{ coins: number }>('GAME/SET_COINS');

export const setBalance = createAction<{ valueInCash: number }>('GAME/SET_BALANCE');

export const setTotalWin = createAction<{ totalWin: number }>('GAME/SET_TOTAL_WIN');

export const setIsDetectingDroppedChips = createAction<{ value: boolean }>('GAME/SET_IS_DETECTING_DROPPED_CHIPS');
export const addChipToChipWinQueue = createAction<IChipWinQueueItem>('GAME/ADD_CHIP_TO_CHIP_WIN_QUEUE');
export const removeChipFromChipWinQueue = createAction<{ id: string }>('GAME/REMOVE_CHIP_FROM_CHIP_WIN_QUEUE');

export const addPhantomChipWinQueueItem = createAction<IPhantomChipWin>('GAME/ADD_PHANTOM_CHIP_WIN_QUEUE_ITEM');
export const mergePhantomChipWinQueueItem = createAction<{ id: PhantomChipWinId; data: Partial<IPhantomChipWin> }>(
  'GAME/MERGE_PHANTOM_CHIP_WIN_QUEUE_ITEM',
);
export const removePhantomChipWinQueueItem = createAction<{ id: PhantomChipWinId }>('GAME/REMOVE_PHANTOM_CHIP_WIN_QUEUE_ITEM');

export const setCancelStacksDialog = createAction<ICancelStacksDialog>('GAME/SET_CANCEL_STACKS_DIALOG');

export const cancelStacks = createAction('GAME/CANCEL_STACKS');

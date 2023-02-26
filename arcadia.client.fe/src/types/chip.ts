import { ChipWinSound } from '../services/sounds/types';

export enum ChipIconId {
  yellow = 'yellow',
  red = 'red',
  green = 'green',
  violet = 'violet',
  phantom = 'phantom',
}

export interface IChip {
  type: string;
  currencyValue: number;
  soundId: ChipWinSound;
  iconId: ChipIconId;
}

export type IChips = IChip[];

import { IChips } from './chip';

export type GroupId = number;

export enum GroupColorId {
  darkBlue = 'darkBlue',
  lightGreen = 'lightGreen',
  mentolGreen = 'mentolGreen',
  orange = 'orange',
  red = 'red',
  purple = 'purple',
  yellow = 'yellow',
}

export interface IGroup {
  groupId: GroupId;
  currency: string;
  color: GroupColorId;
  groupName: string;
  jackpotGameId: string;
  betInCash: number;
  queueLength: number;
  payTable: IChips;
}

export type IGroups = IGroup[];

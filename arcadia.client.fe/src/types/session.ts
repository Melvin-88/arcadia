import { IChips } from './chip';
import { GroupColorId } from './group';
import { PhantomValue, SlotMachineSlotIcon } from './phantomWidget';

export type PlayerId = string;

export enum PhantomWidgetType {
  wheel = 'wheel',
  slot = 'slot'
}

export enum SessionStatus {
  viewer = 'viewer',
  viewerBetBehind = 'viewerBetBehind',
  queueBetBehind = 'queueBetBehind',
  queue = 'queue',
  playing = 'playing',
  autoplay = 'autoplay',
  forcedAutoplay = 'forcedAutoplay',
  reBuy = 'reBuy',
}

export interface ISession {
  playerId: PlayerId;
  sessionId: string;
  machineId: number;
  stackSize: number;
  groupName: string;
  currency: string;
  stackBuyLimit: number;
  idleTimeoutSec: number;
  graceTimeoutSec: number;
  phantomWidgetAnimationDurationMS: number;
  betInCash: number;
  rounds: number;
  streamAuthToken: string;
  videoServiceEnv: string;
  sessionStatus: SessionStatus;
  video: {
    serverUrl: string;
    lowQualityRTSP: string;
    highQualityRTSP: string;
    hlsUrlHighQuality: string;
  };
  payTable: IChips;
  wheel: PhantomValue[];
  slotConfig: SlotMachineSlotIcon[];
  scatterType: PhantomWidgetType | null;
  groupColor: GroupColorId;
}

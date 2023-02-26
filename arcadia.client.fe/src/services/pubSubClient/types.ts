import { IShortestQueueProposal, ISoundsConfig } from '../../modules/app/types';
import { IAutoplayConfig } from '../../types/autoplay';
import { ISession, SessionStatus } from '../../types/session';
import { IChip } from '../../types/chip';
import { IBetBehindConfig } from '../../types/betBehind';
import { IActiveRound } from '../../types/round';
import { IGroups } from '../../types/group';
import { IVoucher, VoucherId } from '../../types/voucher';
import { INotification } from '../../types/notification';
import { Orientation, QuitReason } from '../../types/general';
import { IQueuePlayers } from '../../types/queue';
import { PubSubUserEventNotification } from './constants';
import { IVideoStreamStatusChangeEvent } from '../../components/VideoStream/types';

export interface IPubSubLoginEmitData {
  token: string;
  footprint: string;
  groupId: number;
}

export interface IPubSubBuyStacksEmitData {
  stacks: number;
  voucherId?: VoucherId | null;
}

export interface IPubSubSetAngleEmitData {
  angle: number;
}

export interface IPubSubEnableAutoplayEmitData extends IAutoplayConfig {
}

export interface IPubSubEnableBetBehindEmitData extends IBetBehindConfig {
}

export type IPubSubNotification = INotification;

export interface IPubSubLoginSubscribeData extends ISession {
  jackpotGameId: string;
  autoplayConfig: IAutoplayConfig;
  betBehindConfig: IBetBehindConfig;
}

export interface IPubSubRestoreConnectionSubscribeData extends ISession {
  activeRound?: IActiveRound | null;
  queueToken: string;
  coins: number;
  rounds: number;
  totalWin: number;
  blueRibbonOperatorId: string;
  blueRibbonBaseServiceUrl: string;
  jackpotGameId: string;
}

export interface IPubSubSessionStateSubscribeData {
  status: SessionStatus;
  roundsLeft?: number;
}

export interface IPubSubQueueSubscribeData {
  queue: IQueuePlayers;
  viewers: number;
}

export interface IPubSubBuySubscribeData {
  queueToken: string;
  rounds: number;
}

export interface IPubSubReBuySubscribeData {
  roundsAllowed: number;
}

export interface IPubSubRemainingCoinsSubscribeData {
  remainingCoins: number;
}

export interface IPubSubRoundStartSubscribeData extends IActiveRound {
}

export enum RobotAction {
  ready = 'ready',
  chipDetection = 'ChipDetection',
}

export interface IRobot2PlayerSubscribeData {
  action: RobotAction;
  error: string;
}

export interface IWinSubscribeData extends IChip {
}

export interface IPhantomSubscribeData {
  value: number;
}

export interface ISessionResultSubscribeData {
  totalWin: number;
  currency: string;
  duration: number;
}

export interface IPubSubResetIdleTimeoutSubscribeData {
}

export interface IPubSubBalanceSubscribeData {
  valueInCash: number;
}

export interface IPubSubTotalWinSubscribeData {
  totalWin: number;
}

export enum AutoplayStatus {
  forcedEnable = 'forcedEnable',
}

export interface IPubSubAutoplaySubscribeData {
  status: AutoplayStatus;
  config?: IAutoplayConfig;
}

export interface IPubSubVoucherSubscribeData extends IVoucher {}

export interface IPubSubGroupsSubscribeData {
  groups: IGroups;
}

export interface IPubSubShortestQueueProposalSubscribeData extends IShortestQueueProposal {}

export interface IPubSubConnectData {
  url: string;
}

export interface IPubSubRestoreConnectionData {
  url: string;
  sessionId: string;
  footprint: string;
}

export interface IPubSubQuitEmitData {
  reason: QuitReason;
}

export type IBaseUserEventNotification<TUserEventType, TData = undefined> = {
  type: TUserEventType;
} & (TData extends undefined ? {} : { data: TData });

export type IPubSubSettingsUpdateEventData = IBaseUserEventNotification<PubSubUserEventNotification.settingsUpdate, ISoundsConfig>;

export type IPubSubVideoStreamStatusChangeData = IBaseUserEventNotification<
  PubSubUserEventNotification.video,
  IVideoStreamStatusChangeEvent
>;

export type IPubSubOrientationEventData = IBaseUserEventNotification<
  PubSubUserEventNotification.orientationChanged,
  {
    orientation: Orientation;
  }
>;

export type IPubSubLostFocusEventData = IBaseUserEventNotification<PubSubUserEventNotification.lostFocus>;

export type IPubSubRegainedFocusEventData = IBaseUserEventNotification<PubSubUserEventNotification.regainedFocus>;

export type IPubSubMenuClickEventData = IBaseUserEventNotification<PubSubUserEventNotification.menuClicked>;

export type IPubSubMenuClosedEventData = IBaseUserEventNotification<PubSubUserEventNotification.menuClosed>;

export type PubSubUserEventNotificationData =
  IPubSubSettingsUpdateEventData |
  IPubSubVideoStreamStatusChangeData |
  IPubSubOrientationEventData |
  IPubSubLostFocusEventData |
  IPubSubRegainedFocusEventData |
  IPubSubMenuClickEventData |
  IPubSubMenuClosedEventData;

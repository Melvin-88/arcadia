import io from 'socket.io-client';
import { EventEmitter } from 'events';
import { EmitEventType, PubSubUserEventNotification, SubscribeEventType } from './constants';
import { TiltMode } from '../../types/autoplay';
import {
  IPubSubConnectData,
  IPubSubLoginEmitData,
  IPubSubBuyStacksEmitData,
  IPubSubLoginSubscribeData,
  IPubSubQueueSubscribeData,
  IPubSubBuySubscribeData,
  IPubSubReBuySubscribeData,
  IPubSubRemainingCoinsSubscribeData,
  IRobot2PlayerSubscribeData,
  IWinSubscribeData,
  ISessionResultSubscribeData,
  IPubSubRestoreConnectionData,
  IPubSubRestoreConnectionSubscribeData,
  IPubSubResetIdleTimeoutSubscribeData,
  IPubSubBalanceSubscribeData,
  IPubSubTotalWinSubscribeData,
  IPubSubSetAngleEmitData,
  IPubSubEnableAutoplayEmitData,
  IPubSubAutoplaySubscribeData,
  IPubSubSessionStateSubscribeData,
  IPubSubEnableBetBehindEmitData,
  IPubSubRoundStartSubscribeData,
  IPubSubShortestQueueProposalSubscribeData,
  IPubSubVoucherSubscribeData,
  IPhantomSubscribeData,
  IPubSubGroupsSubscribeData,
  IPubSubNotification,
  IPubSubQuitEmitData,
  PubSubUserEventNotificationData,
} from './types';

export declare interface PubSubClient {
  on(event: SubscribeEventType.connect, listener: () => void): this;
  on(event: SubscribeEventType.login, listener: (data: IPubSubLoginSubscribeData) => void): this;
  on(event: SubscribeEventType.restoreConnection, listener: (data: IPubSubRestoreConnectionSubscribeData) => void): this;
  on(event: SubscribeEventType.sessionState, listener: (data: IPubSubSessionStateSubscribeData) => void): this;
  on(event: SubscribeEventType.queue, listener: (data: IPubSubQueueSubscribeData) => void): this;
  on(event: SubscribeEventType.buy, listener: (data: IPubSubBuySubscribeData) => void): this;
  on(event: SubscribeEventType.reBuy, listener: (data: IPubSubReBuySubscribeData) => void): this;
  on(event: SubscribeEventType.remainingCoins, listener: (data: IPubSubRemainingCoinsSubscribeData) => void): this;
  on(event: SubscribeEventType.roundStart, listener: (data: IPubSubRoundStartSubscribeData) => void): this;
  on(event: SubscribeEventType.robot2player, listener: (data: IRobot2PlayerSubscribeData) => void): this;
  on(event: SubscribeEventType.win, listener: (data: IWinSubscribeData) => void): this;
  on(event: SubscribeEventType.phantom, listener: (data: IPhantomSubscribeData) => void): this;
  on(event: SubscribeEventType.sessionResult, listener: (data: ISessionResultSubscribeData) => void): this;
  on(event: SubscribeEventType.resetIdleTimeout, listener: (data: IPubSubResetIdleTimeoutSubscribeData) => void): this;
  on(event: SubscribeEventType.balance, listener: (data: IPubSubBalanceSubscribeData) => void): this;
  on(event: SubscribeEventType.totalWin, listener: (data: IPubSubTotalWinSubscribeData) => void): this;
  on(event: SubscribeEventType.autoplay, listener: (data: IPubSubAutoplaySubscribeData) => void): this;
  on(event: SubscribeEventType.voucher, listener: (data: IPubSubVoucherSubscribeData) => void): this;
  on(event: SubscribeEventType.bets, listener: (data: IPubSubGroupsSubscribeData) => void): this;
  on(event: SubscribeEventType.shortestQueueProposal, listener: (data: IPubSubShortestQueueProposalSubscribeData) => void): this;
  on(event: SubscribeEventType.disconnect, listener: (reason: string) => void): this;
  on(event: SubscribeEventType.notification, listener: (notification: IPubSubNotification) => void): this;
  on(event: SubscribeEventType.returnToLobby, listener: () => void): this;
}

export class PubSubClient extends EventEmitter {
  private static instance: PubSubClient;
  private socket: SocketIOClient.Socket | null = null;

  // The rule is disabled to be able to create Singleton
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance(): PubSubClient {
    if (!PubSubClient.instance) {
      PubSubClient.instance = new PubSubClient();
    }

    return PubSubClient.instance;
  }

  isSocketConnected = () => !!this.socket;

  connect = ({ url }: IPubSubConnectData) => {
    this.socket = io(url);

    this.socket.on(SubscribeEventType.connect, this.handleOnConnect);
    this.socket.on(SubscribeEventType.login, this.handleOnLogin);
    this.socket.on(SubscribeEventType.restoreConnection, this.handleOnRestoreConnection);
    this.socket.on(SubscribeEventType.sessionState, this.handleOnSessionState);
    this.socket.on(SubscribeEventType.queue, this.handleOnQueueChange);
    this.socket.on(SubscribeEventType.buy, this.handleOnBuy);
    this.socket.on(SubscribeEventType.reBuy, this.handleOnReBuy);
    this.socket.on(SubscribeEventType.remainingCoins, this.handleOnRemainingCoins);
    this.socket.on(SubscribeEventType.roundStart, this.handleOnRoundStart);
    this.socket.on(SubscribeEventType.robot2player, this.handleOnRobot2Player);
    this.socket.on(SubscribeEventType.win, this.handleWin);
    this.socket.on(SubscribeEventType.phantom, this.handleOnPhantom);
    this.socket.on(SubscribeEventType.sessionResult, this.handleSessionResult);
    this.socket.on(SubscribeEventType.resetIdleTimeout, this.handleResetIdleTimeout);
    this.socket.on(SubscribeEventType.balance, this.handleOnBalance);
    this.socket.on(SubscribeEventType.totalWin, this.handleOnTotalWin);
    this.socket.on(SubscribeEventType.autoplay, this.handleOnAutoplay);
    this.socket.on(SubscribeEventType.voucher, this.handleOnVoucher);
    this.socket.on(SubscribeEventType.disconnect, this.handleOnDisconnect);
    this.socket.on(SubscribeEventType.bets, this.handleOnBets);
    this.socket.on(SubscribeEventType.shortestQueueProposal, this.handleOnShortestQueueProposal);
    this.socket.on(SubscribeEventType.notification, this.handleOnNotification);
    this.socket.on(SubscribeEventType.returnToLobby, this.handleOnReturnToLobby);

    this.handleSetupDebugger(); // TODO: [PRE-PRODUCTION] Remove when process.env !== 'development'

    return new Promise((resolve) => {
      this.socket!.on(SubscribeEventType.connect, () => {
        resolve(this.socket);
      });
    });
  };

  login = (data: IPubSubLoginEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.login, data);
    }
  };

  restoreConnection = (data: IPubSubRestoreConnectionData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.restoreConnection, data);
    }
  };

  buyRounds = (data: IPubSubBuyStacksEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.buy, data);
    }
  };

  initUserInMachine = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.init);
    }
  };

  openFire = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.openFire);
    }
  };

  ceaseFire = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.ceaseFire);
    }
  };

  setAngle = (data: IPubSubSetAngleEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.setAngle, data);
    }
  };

  enableAutoplay = (data: IPubSubEnableAutoplayEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.enableAutoplay, data);
    }
  };

  disableAutoplay = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.disableAutoplay);
    }
  };

  enableBetBehind = (data: IPubSubEnableBetBehindEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.enableBetBehind, data);
    }
  };

  disableBetBehind = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.disableBetBehind);
    }
  };

  setSwingMode = (mode: TiltMode) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.setSwingMode, mode);
    }
  };

  getVoucher = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.voucher);
    }
  };

  requestBalance = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.balance);
    }
  };

  leaveQueue = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.leaveQueue);
    }
  };

  getGroups = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.listbets);
    }
  };

  cancelStacks = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.cancelStacks);
    }
  };

  forceDisconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
    }
  };

  quit = (data: IPubSubQuitEmitData) => {
    if (this.socket) {
      this.socket.emit(EmitEventType.quit, data);
    }
  };

  readyForNextRound = () => {
    if (this.socket) {
      this.socket.emit(EmitEventType.readyForNextRound);
    }
  };

  sendUserEventNotification = (event: PubSubUserEventNotificationData) => {
    if (this.socket) {
      switch (event.type) {
        case PubSubUserEventNotification.orientationChanged:
        case PubSubUserEventNotification.settingsUpdate:
        case PubSubUserEventNotification.video:
          this.socket.emit(event.type, event.data);
          break;
        default:
          this.socket.emit(event.type);
          break;
      }
    }
  };

  private handleOnConnect = () => {
    this.emit(SubscribeEventType.connect);
  };

  private handleOnLogin = (data: IPubSubLoginSubscribeData) => {
    this.emit(SubscribeEventType.login, data);
  };

  private handleOnRestoreConnection = (data: IPubSubRestoreConnectionSubscribeData) => {
    this.emit(SubscribeEventType.restoreConnection, data);
  };

  private handleOnSessionState = (data: IPubSubSessionStateSubscribeData) => {
    this.emit(SubscribeEventType.sessionState, data);
  };

  private handleOnQueueChange = (data: IPubSubQueueSubscribeData) => {
    this.emit(SubscribeEventType.queue, data);
  };

  private handleOnBuy = (data: IPubSubBuySubscribeData) => {
    this.emit(SubscribeEventType.buy, data);
  };

  private handleOnReBuy = (data: IPubSubReBuySubscribeData) => {
    this.emit(SubscribeEventType.reBuy, data);
  };

  private handleOnRemainingCoins = (data: IPubSubRemainingCoinsSubscribeData) => {
    this.emit(SubscribeEventType.remainingCoins, data);
  };

  private handleOnRoundStart = (data: IPubSubRoundStartSubscribeData) => {
    this.emit(SubscribeEventType.roundStart, data);
  };

  private handleOnRobot2Player = (data: IRobot2PlayerSubscribeData) => {
    this.emit(SubscribeEventType.robot2player, data);
  };

  private handleWin = (data: IWinSubscribeData) => {
    this.emit(SubscribeEventType.win, data);
  };

  private handleOnPhantom = (data: IPhantomSubscribeData) => {
    this.emit(SubscribeEventType.phantom, data);
  };

  private handleSessionResult = (data: ISessionResultSubscribeData) => {
    this.emit(SubscribeEventType.sessionResult, data);
  };

  private handleResetIdleTimeout = (data: IPubSubResetIdleTimeoutSubscribeData) => {
    this.emit(SubscribeEventType.resetIdleTimeout, data);
  };

  private handleOnBalance = (data: IPubSubBalanceSubscribeData) => {
    this.emit(SubscribeEventType.balance, data);
  };

  private handleOnTotalWin = (data: IPubSubTotalWinSubscribeData) => {
    this.emit(SubscribeEventType.totalWin, data);
  };

  private handleOnAutoplay = (data: IPubSubAutoplaySubscribeData) => {
    this.emit(SubscribeEventType.autoplay, data);
  };

  private handleOnVoucher = (data: IPubSubVoucherSubscribeData) => {
    this.emit(SubscribeEventType.voucher, data);
  };

  private handleOnBets = (data: IPubSubGroupsSubscribeData) => {
    this.emit(SubscribeEventType.bets, data);
  };

  private handleOnShortestQueueProposal = (data: IPubSubShortestQueueProposalSubscribeData) => {
    this.emit(SubscribeEventType.shortestQueueProposal, data);
  };

  private handleOnDisconnect = (reason: string) => {
    this.emit(SubscribeEventType.disconnect, reason);
  };

  private handleOnNotification = (data: IPubSubNotification) => {
    this.emit(SubscribeEventType.notification, data);
  };

  private handleOnReturnToLobby = () => {
    this.emit(SubscribeEventType.returnToLobby);
  };

  private handleSetupDebugger = () => {
    Object.values(SubscribeEventType).forEach((event: any) => {
      if (this.socket) {
        this.socket.on(event, (data: any) => {
          /* eslint-disable no-console */
          console.groupCollapsed(`%c Socket Subscribe ======= ${event} =======`, 'background: #222; color: #bada55');
          console.log(JSON.stringify(data, null, 4));
          console.groupEnd();
          /* eslint-enable no-console */
        });
      }
    });
  };
}

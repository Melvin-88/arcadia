import { toast } from 'react-toastify';
import { loginAnonymousPlayer, loginAuthenticatedPlayer } from '../helpers';
// TODO: Fix ESLint import/no-cycle issue
// eslint-disable-next-line import/no-cycle
import { store } from '../../../store/store';
import {
  setJackpotIsActive,
  processBlueRibbonPlayerOptEvent,
  setJackpotPotState,
  processBlueRibbonWinEvent,
} from '../state/actions';
import {
  IBlueRibbonConnectConfiguration,
  IBlueRibbonConnectionActivityChangedEventPayload,
  IBlueRibbonGame,
  IBlueRibbonOptInEventPayload,
  IBlueRibbonOptOutEventPayload,
  IBlueRibbonPotStateChangedEventPayload,
  IBlueRibbonSetupData,
  IBlueRibbonWinEventPayload,
} from './types';

export class BlueRibbonController {
  private sdkInstance: any; // TODO: Use type after Blue Ribbon SDK TS support arrive
  private static instance: BlueRibbonController;

  static getInstance(): BlueRibbonController {
    if (!BlueRibbonController.instance) {
      BlueRibbonController.instance = new BlueRibbonController();
    }

    return BlueRibbonController.instance;
  }

  setup = async ({ operatorId, playerId, currency }: IBlueRibbonSetupData) => {
    const blueRibbonConfig = {
      loginAnonymousPlayer,
      loginAuthenticatedPlayer,
      operatorId,
      baseServiceUrl: 'https://api.demo00.bluerbn.com', // TODO: Use from params after API fix
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    };

    this.sdkInstance = new window.BlueRibbon.SdkCoreManager(blueRibbonConfig);

    this.setupEventListeners();

    await this.connect({
      playerId,
      currency,
    });
  };

  connect = async (connectConfiguration: IBlueRibbonConnectConfiguration) => {
    try {
      await this.sdkInstance.connect(connectConfiguration);

      const startFeedOptions = {
        games: null,
        gamesMode: window.BlueRibbon.constants.gamesMode.IN_GAME,
      };

      this.sdkInstance.startGamesFeed(startFeedOptions);
    } catch (error) {
      toast.error(error.message);
    }
  };

  optInPlayerToJackpotGame = (game: IBlueRibbonGame) => {
    this.sdkInstance.player.optInPlayerToJackpotGame(game);
  };

  optOutPlayerToJackpotGame = (game: IBlueRibbonGame) => {
    this.sdkInstance.player.optOutPlayerToJackpotGame(game);
  };

  isPlayerOptInToJackpotGame = async (game: IBlueRibbonGame) => (
    this.sdkInstance.player.isPlayerOptInToJackpotGame(game)
  );

  private setupEventListeners = () => {
    this.sdkInstance.events.on(
      window.BlueRibbon.constants.events.CONNECTION_ACTIVITY_CHANGED,
      (data: IBlueRibbonConnectionActivityChangedEventPayload) => {
        store.dispatch(setJackpotIsActive(data.connectionDetails));
      },
    );

    this.sdkInstance.events.on(window.BlueRibbon.constants.events.OPT_IN_EVENT, ({ playerOptState }: IBlueRibbonOptInEventPayload) => {
      const { playerId, gameId } = playerOptState;

      store.dispatch(processBlueRibbonPlayerOptEvent({
        gameId,
        playerId,
        isOptInEnabled: true,
      }));
    });

    this.sdkInstance.events.on(window.BlueRibbon.constants.events.OPT_OUT_EVENT, ({ playerOptState }: IBlueRibbonOptOutEventPayload) => {
      const { playerId, gameId } = playerOptState;

      store.dispatch(processBlueRibbonPlayerOptEvent({
        gameId,
        playerId,
        isOptInEnabled: false,
      }));
    });

    this.sdkInstance.events.on(
      window.BlueRibbon.constants.events.POT_STATE_CHANGED_EVENT,
      ({ jackpotPotState }: IBlueRibbonPotStateChangedEventPayload) => {
        const { gameId, progressive, ...restData } = jackpotPotState;

        store.dispatch(setJackpotPotState({
          gameId: jackpotPotState.gameId,
          potState: {
            ...restData,
            gameId,
            valueInCash: progressive,
          },
        }));
      },
    );

    this.sdkInstance.events.on(window.BlueRibbon.constants.events.WIN_EVENT, ({ winningDetails }: IBlueRibbonWinEventPayload) => {
      store.dispatch(processBlueRibbonWinEvent({ winningDetails }));
    });
  };
}

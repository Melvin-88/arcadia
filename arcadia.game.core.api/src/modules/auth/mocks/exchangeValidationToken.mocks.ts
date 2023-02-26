import { GroupStatus, SessionStatus } from 'arcadia-dal';
import * as roomNameTemplate from '../../messaging/room.name.template';

export function shouldReturnSessionDataMock(spyTargets: any): void {
// @ts-ignore
  jest.spyOn(spyTargets.playerRepository, 'findOneOrFail').mockReturnValue(Promise.resolve({
    cid: '1',
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.groupRepository, 'findOneOrFail').mockReturnValue(Promise.resolve({
    id: 1,
    name: '<group>',
    stackSize: 1,
    stackBuyLimit: 1,
    idleTimeout: 1,
    denominator: 10,
    status: GroupStatus.IN_PLAY,
    operator: {
      configuration: {
        autoplay: {},
      },
    },
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.machineRepository, 'getMachineForNewSession').mockResolvedValueOnce({
    id: 1,
    name: '<machine>',
    configuration: {
      wheelAnimationDuration: 1,
    },
  });
  jest.spyOn(spyTargets.authService, 'getSessionOptions').mockReturnValue(Promise.resolve({
    sessionOptions: {
      totalStacksUsed: 1,
      playerIP: '0.0.0.0',
      currency: 'EUR',
      clientVersion: '1.0.0',
      os: 'Linux',
      deviceType: 'PC',
      browser: 'Chrome',
      locale: 'en',
      streamAuthToken: '<streamToken>',
    },
    sessionToken: '<token>',
  }));
  jest.spyOn(spyTargets.configValidator, 'getValidatedConfig').mockResolvedValue({ countryWhitelist: ['US'] });
  // @ts-ignore
  jest.spyOn(spyTargets.currencyConversionRepository, 'getCurrencyConversion').mockReturnValueOnce(Promise.resolve({
    rate: 1,
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.videoApiClientService, 'getCameraStreams').mockReturnValue(Promise.resolve({
    recorded: true,
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.sessionService, 'create').mockReturnValue(Promise.resolve({
    id: '1',
    currency: 'usd',
    currencyConversionRate: 1,
    locale: 'ru',
    status: SessionStatus.PLAYING,
    machine: {
      id: 1,
      name: '<machine>',
      cameraID: '1',
      configuration: {
        wheelAnimationDuration: 1,
      },
    },
    group: {
      id: 1,
    },
    player: {
      cid: '1',
    },
    configuration: {
      autoplay: {},
      betBehind: {},
      scatterType: '<scatter>',
      slot: {},
      wheelAnimationDuration: 1,
    }
  }));
  jest.spyOn(spyTargets.rngPrizeRepository, 'getAllPrizes').mockResolvedValue([]);
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue({
    isActivePlayingStatus: () => true,
  });
  jest.spyOn(roomNameTemplate, 'sessionRoomNameFactory').mockReturnValue('room');
  jest.spyOn(roomNameTemplate, 'getRobotDirectRoom').mockReturnValue('room');
  jest.spyOn(roomNameTemplate, 'getRobotQueueRoom').mockReturnValue('room');
  jest.spyOn(spyTargets.authService, 'getWheelData').mockResolvedValue([1, 2]);
}

export function noMachinesExceptionMock(spyTargets: any): void {
// @ts-ignore
  jest.spyOn(spyTargets.groupRepository, 'findOneOrFail').mockReturnValue(Promise.resolve({
    id: 1,
    denominator: 10,
    status: GroupStatus.IN_PLAY,
    operator: {
      configuration: {
        autoplay: {},
      },
    },
  }));
  jest.spyOn(spyTargets.machineRepository, 'getMachineForNewSession').mockResolvedValueOnce(null);
}

export function noConversionRateMock(spyTargets: any): void {
// @ts-ignore
  jest.spyOn(spyTargets.groupRepository, 'findOneOrFail').mockReturnValue(Promise.resolve({
    id: 1,
    denominator: 10,
    status: GroupStatus.IN_PLAY,
    operator: {
      configuration: {
        autoplay: {},
      },
    },
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.machineRepository, 'getMachineForNewSession').mockResolvedValueOnce({
    id: 1,
    configuration: {
      wheelAnimationDuration: 1,
    },
  });
  jest.spyOn(spyTargets.authService, 'getSessionOptions').mockReturnValue(Promise.resolve({
    sessionOptions: {
      totalStacksUsed: 1,
      playerIP: '0.0.0.0',
      currency: 'EUR',
      clientVersion: '1.0.0',
      os: 'Linux',
      deviceType: 'PC',
      browser: 'Chrome',
      locale: 'en',
      streamAuthToken: '<streamToken>',
    },
    sessionToken: '<token>',
  }));
}

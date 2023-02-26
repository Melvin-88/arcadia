import { SessionStatus } from 'arcadia-dal';
import * as roomNameTemplate from '../../messaging/room.name.template';
import { SessionService } from '../../session/session.service';

export function shouldReturnSessionDataMock(spyTargets: any): void {
// @ts-ignore
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve({
    id: '1',
    currency: 'usd',
    currencyConversionRate: 1,
    locale: 'ru',
    status: SessionStatus.PLAYING,
    configuration: {
      autoplay: {},
      wheelAnimationDuration: 1,
    },
    machine: {
      id: 1,
      name: '<machine>',
      cameraID: '1',
      configuration: {
        wheelAnimationDuration: 1,
      },
    },
    group: {
      name: '<group>',
      operator: {},
      stackSize: 1,
      stackBuyLimit: 1,
      idleTimeout: 1,
      denominator: 322,
    },
    player: {
      cid: '1',
    },
  }));
  jest.spyOn(spyTargets.videoApiClientService, 'getCameraStreams').mockResolvedValue({});
  jest.spyOn(spyTargets.rngPrizeRepository, 'getAllPrizes').mockResolvedValue([]);
  jest.spyOn(spyTargets.authService, 'getWheelData').mockResolvedValue([1, 2]);
  jest.spyOn(roomNameTemplate, 'sessionRoomNameFactory').mockReturnValue('room');
  jest.spyOn(roomNameTemplate, 'getRobotDirectRoom').mockReturnValue('room');
  jest.spyOn(roomNameTemplate, 'getRobotQueueRoom').mockReturnValue('room');
  jest.spyOn(spyTargets.videoApiClientService, 'getCameraStreamsFormatted').mockReturnValue(Promise.resolve(null));
  //jest.spyOn(SessionService, 'getAutoplayConfig').mockReturnValue(null);
}

export function noSessionDataExceptionMock(spyTargets: any): void {
// @ts-ignore
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve(null));
}

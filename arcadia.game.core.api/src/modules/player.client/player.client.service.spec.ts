import { SocketIOEmitter } from 'socket.io-emitter';
import { makeTestModule } from './mocks/beforeAll.mock';
import { PlayerClientService } from './player.client.service';
import { REDIS_PUBLISHER_CLIENT } from '../../constants/redis.constants';
import { PlayerMessageType } from '../messaging/player.handling/enum/player.message.type';
import { ErrorType } from '../messaging/player.handling/enum/error.type.enum';
import { AutoplayStatus } from '../messaging/player.handling/enum/autoplay.status';

describe('Player Client Service (Unit)', () => {
  let playerClientService: PlayerClientService;
  let emitter: SocketIOEmitter;
  let emitSpy: any;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    playerClientService = moduleFixture.get<PlayerClientService>(PlayerClientService);
    emitter = moduleFixture.get<SocketIOEmitter>(REDIS_PUBLISHER_CLIENT);
    emitSpy = jest.spyOn(emitter, 'emit');
  });

  describe('notifySessionResult', () => {
    it('should send notify session result message', async () => {
      await playerClientService.notifySessionResult('<cid>', { currency: '', duration: 0, totalWin: 0 });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.SESSION_RESULT, { currency: '', duration: 0, totalWin: 0 });
    });
  });

  describe('notifyWin', () => {
    it('should send notify win message', async () => {
      await playerClientService.notifyWin('<cid>', {
        currencyValue: 0, type: '', soundId: '', iconId: '',
      });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.WIN, { amount: 0, chipType: '', soundId: '' });
    });
  });

  describe('notifyTotalWin', () => {
    it('should send notify total win message', async () => {
      await playerClientService.notifyTotalWin('<cid>', { totalWin: 0 });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.TOTAL_WIN, { totalWin: 0 });
    });
  });

  describe('notifyQueueUpdate', () => {
    it('should send queue update message', async () => {
      await playerClientService.notifyQueueUpdate('<cid>', { queue: [], viewers: 0 });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.QUEUE, { queue: [], viewers: 0 });
    });
  });

  describe('sendError', () => {
    it('should send error message', async () => {
      await playerClientService.sendError('<chan>', { message: '', type: ErrorType.MACHINE_MALFUNCTION });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.ERROR, { message: '', type: ErrorType.MACHINE_MALFUNCTION });
    });
  });

  describe('notifyBuyResult', () => {
    it('should send notify buy result message', async () => {
      await playerClientService.notifyBuyResult('<cid>', '<token>', 5);
      expect(emitSpy).toBeCalledWith(PlayerMessageType.BUY, { queueToken: '<token>', rounds: 5 });
    });
  });

  describe('notifyQueueChangeOffer', () => {
    it('should send notify queue change offer message', async () => {
      await playerClientService.notifyQueueChangeOffer('<cid>');
      expect(emitSpy).toBeCalledWith(PlayerMessageType.QUEUE_CHANGE_OFFER);
    });
  });

  describe('notifyQueueChangeData', () => {
    it('should send notify queue change data message', async () => {
      const data = {
        robotDirectRoomId: '',
        robotQueueRoomId: '',
        video: { highQualityRTSP: '', lowQualityRTSP: '', serverUrl: '' },
      };
      await playerClientService.notifyQueueChangeData('<cid>', data);
      expect(emitSpy).toBeCalledWith(PlayerMessageType.QUEUE_CHANGE_DATA, data);
    });
  });

  describe('notifyRebuy', () => {
    it('should send notify rebuy message', async () => {
      await playerClientService.notifyRebuy('<cid>', { graceTimeoutSec: 0, roundsAllowed: 0 });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.RE_BUY, { graceTimeoutSec: 0, roundsAllowed: 0 });
    });
  });

  describe('sendNotification', () => {
    it('should send notification message', async () => {
      await playerClientService.sendNotification('<cid>', { message: '' });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.NOTIFICATION, { message: '' });
    });
  });

  describe('forceInitMessage', () => {
    it('should send force init message', async () => {
      await playerClientService.forceInitMessage('<cid>', 5, '<corr>');
      expect(emitSpy).toBeCalledWith(PlayerMessageType.PLAYER_TO_ROBOT, { action: 'init', correlationId: '<corr>' });
    });
  });

  describe('notifyAutoplay', () => {
    it('should send notify autoplay message', async () => {
      await playerClientService.notifyAutoplay('<cid>', { status: AutoplayStatus.FORCED_DISABLE });
      expect(emitSpy).toBeCalledWith(PlayerMessageType.AUTOPLAY, { status: AutoplayStatus.FORCED_DISABLE });
    });
  });

  describe('notifyPhantom', () => {
    it('should send notify phantom message', async () => {
      await playerClientService.notifyPhantom('<cid>', {});
      expect(emitSpy).toBeCalledWith(PlayerMessageType.PHANTOM, {});
    });
  });

  describe('sendBets', () => {
    it('should send bets message', async () => {
      await playerClientService.sendBets('<cid>', [{}]);
      expect(emitSpy).toBeCalledWith(PlayerMessageType.BETS, [{}]);
    });
  });

  describe('notifyReturnToLobby', () => {
    it('should send notify return to lobby message', async () => {
      await playerClientService.notifyReturnToLobby('<cid>');
      expect(emitSpy).toBeCalledWith(PlayerMessageType.RETURN_TO_LOBBY);
    });
  });

  describe('notifyIdleTimoutReset', () => {
    it('should send notify idle timeout reset message', async () => {
      await playerClientService.notifyIdleTimoutReset('<cid>');
      expect(emitSpy).toBeCalledWith(PlayerMessageType.RESET_IDLE_TIMEOUT);
    });
  });
});

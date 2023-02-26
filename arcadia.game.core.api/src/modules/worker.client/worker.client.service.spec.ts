import { SessionStatus, TiltMode } from 'arcadia-dal';
import { WorkerClientService } from './worker.client.service';
import { makeTestModule, workerRmqServerMock } from './mocks/beforeAll.mock';
import { CORE_TO_WORKER_QUEUE } from '../../constants/rabbit.constants';
import { WorkerMessage } from '../messaging/robot.handling/enum/worker.message';
import { PlayerClientService } from '../player.client/player.client.service';

jest.mock('../logger/logger.service');

describe('Worker Client Service (Unit)', () => {
  let workerClientService: WorkerClientService;
  let sendWorkerMessageSpy: any;
  let playerClientService: PlayerClientService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    workerClientService = moduleFixture.get<WorkerClientService>(WorkerClientService);
    playerClientService = moduleFixture.get<PlayerClientService>(PlayerClientService);
    sendWorkerMessageSpy = jest.spyOn(workerClientService, 'sendWorkerMessage');

    await workerClientService.onModuleInit();
  });

  describe('sendWorkerMessage', () => {
    it('should send message to worker using rabbitMQ', async () => {
      const sendMessageSpy = jest.spyOn(workerRmqServerMock, 'sendMessage');
      const message = {
        type: WorkerMessage.JACKPOT_RELOGIN_START,
      };

      await workerClientService.sendWorkerMessage(message, '<corr>');

      expect(sendMessageSpy).toBeCalledWith(message, CORE_TO_WORKER_QUEUE, '<corr>');
    });
  });

  describe('startIdleTimeout', () => {
    it('should send start idle timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_IDLE_START,
        sessionId: 1,
        correlationId: '<corr>',
      };
      const notifyTimeoutResetSpy = jest.spyOn(playerClientService, 'notifyIdleTimoutReset');

      await workerClientService.startIdleTimeout(message.sessionId, '<cid>', message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
      expect(notifyTimeoutResetSpy).toBeCalledWith('<cid>');
    });
  });

  describe('stopIdleTimeout', () => {
    it('should send stop idle timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_IDLE_STOP,
        sessionId: 1,
        correlationId: '<corr>',
      };
      await workerClientService.stopIdleTimeout(message.sessionId, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });

  describe('startGraceTimeout', () => {
    it('should send start grace timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_GRACE_START,
        sessionId: 1,
        correlationId: '<corr>',
      };
      await workerClientService.startGraceTimeout(message.sessionId, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });

  describe('stopGraceTimeout', () => {
    it('should send stop grace timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_GRACE_STOP,
        sessionId: 1,
        correlationId: '<corr>',
      };
      await workerClientService.stopGraceTimeout(message.sessionId, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });

  describe('startEngageTimeout', () => {
    it('should send start engage timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_ENGAGE_START,
        sessionId: 1,
        correlationId: '<corr>',
      };
      await workerClientService.startEngageTimeout(message.sessionId, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });

  describe('stopEngageTimeout', () => {
    it('should send stop engage timeout message', async () => {
      const message = {
        type: WorkerMessage.PLAYER_ENGAGE_STOP,
        sessionId: 1,
        correlationId: '<corr>',
      };
      await workerClientService.stopEngageTimeout(message.sessionId, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });

  describe('startJackpotReloginTimeout', () => {
    it('should send start jackpot relogin timeout message', async () => {
      const message = {
        type: WorkerMessage.JACKPOT_RELOGIN_START,
      };
      await workerClientService.startJackpotReloginTimeout();

      expect(sendWorkerMessageSpy).toBeCalledWith(message);
    });
  });

  describe('stopJackpotReloginTimeout', () => {
    it('should send stop jackpot relogin timeout message', async () => {
      const message = {
        type: WorkerMessage.JACKPOT_RELOGIN_STOP,
      };
      await workerClientService.stopJackpotReloginTimeout();

      expect(sendWorkerMessageSpy).toBeCalledWith(message);
    });
  });

  describe('startPhantomDelayTimeout', () => {
    it('should send start phantom delay timeout message', async () => {
      const message = {
        type: WorkerMessage.PHANTOM_DELAY_START,
        sessionId: 1,
        timeout: 10,
        correlationId: '<corr>',
        tiltMode: TiltMode.AUTO,
        autoplay: SessionStatus.FORCED_AUTOPLAY,
      };
      await workerClientService
        .startPhantomDelayTimeout(message.sessionId, message.timeout, { tiltMode: TiltMode.AUTO, autoplay: SessionStatus.FORCED_AUTOPLAY }, message.correlationId);

      expect(sendWorkerMessageSpy).toBeCalledWith(message, message.correlationId);
    });
  });
});

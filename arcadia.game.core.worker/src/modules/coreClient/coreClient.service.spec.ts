import { CoreClientService } from './coreClient.service';
import { coreClientRmqServerMock, makeTestModule } from './mocks/beforeAll.mock';
import { WORKER_TO_CORE_QUEUE } from './coreClient.queue.names';
import { CoreMessage } from './enum/core.message.type';
import { QueueChangeOffer } from './queueChangeOffer';

jest.mock('../logger/logger.service');

describe('Core Client Service (Unit)', () => {
  let coreClientService: CoreClientService;
  let sendMessageSpy: any;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    coreClientService = moduleFixture.get<CoreClientService>(CoreClientService);
    sendMessageSpy = jest.spyOn(coreClientService, 'sendMessage');
    await coreClientService.onModuleInit();
  });

  describe('sendMessage', () => {
    it('should send message to core api using rabbitMQ', async () => {
      const sendMessageSpy = jest.spyOn(coreClientRmqServerMock, 'sendMessage');
      const msg = { correlationId: '<corr>' };
      await coreClientService.sendMessage(msg);
      expect(sendMessageSpy).toBeCalledWith(msg, WORKER_TO_CORE_QUEUE, msg.correlationId);
    });
  });

  describe('sendIdleTimeoutMessage', () => {
    it('should send idle timeout message', async () => {
      const msg = { type: CoreMessage.IDLE_TIMEOUT, sessionId: 1, correlationId: '<corr>' };
      await coreClientService.sendIdleTimeoutMessage(msg.sessionId, msg.correlationId);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });

  describe('sendGraceTimeoutMessage', () => {
    it('should send grace timeout message', async () => {
      const msg = { type: CoreMessage.GRACE_TIMEOUT, sessionId: 1, correlationId: '<corr>' };
      await coreClientService.sendGraceTimeoutMessage(msg.sessionId, msg.correlationId);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });

  describe('sendEngageTimeoutMessage', () => {
    it('should send engage timeout message', async () => {
      const msg = { type: CoreMessage.ENGAGE_TIMEOUT, sessionId: 1, correlationId: '<corr>' };
      await coreClientService.sendEngageTimeoutMessage(msg.sessionId, msg.correlationId);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
  describe('sendQueueChangeOffersMessage', () => {
    it('should send queue change offers message', async () => {
      const queueChangeOffer: QueueChangeOffer = {
        sessionId: 42,
        toQueueId: 12,
        position: 0,
      };
      const msg = { type: CoreMessage.QUEUE_CHANGE_OFFERS, ...queueChangeOffer, correlationId: '<corr>' };
      await coreClientService.sendQueueChangeOfferMessage(queueChangeOffer, msg.correlationId);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
  describe('sendJackpotReloginTimeoutMessage', () => {
    it('should send jackpot relogin timeout message', async () => {
      const msg = { type: CoreMessage.JACKPOT_RELOGIN_TIMEOUT, correlationId: '<corr>' };
      await coreClientService.sendJackpotReloginTimeoutMessage(msg.correlationId);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
  describe('sendRoundEndDelayMessage', () => {
    it('should send round delay delay message', async () => {
      const msg = { type: CoreMessage.ROUND_END_DELAY, correlationId: '<corr>' };
      await coreClientService.sendRoundEndDelayMessage({ correlationId: msg.correlationId });
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
  describe('terminateViewers', () => {
    it('should send terminate viewers message', async () => {
      const msg = { type: CoreMessage.TERMINATE_VIEWERS, ids: [1, 2, 3] };
      await coreClientService.terminateViewers([1, 2, 3]);
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
  describe('sendPingOutdatedMessage', () => {
    it('should send ping outdated message', async () => {
      const msg = { type: CoreMessage.PING_OUTDATED, serial: '<serial>' };
      await coreClientService.sendPingOutdatedMessage('<serial>');
      expect(sendMessageSpy).toBeCalledWith(msg);
    });
  });
});
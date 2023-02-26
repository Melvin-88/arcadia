import {
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  RoundRepository,
  SessionEndReason,
  SessionRepository,
  SessionStatus,
  TiltMode,
} from 'arcadia-dal';
import { makeTestModule } from './mocks/beforeAll.mock';
import { PlayerMessageService } from './player.message.service';
import { shouldHandleReconnect, shouldNotifyQueueUpdate } from './mocks/userJoinedHandler.mocks';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import {
  shouldMarkDisconnected,
} from './mocks/userLeftHandler.mocks';
import { SessionService } from '../../session/session.service';
import {
  buyStacksHandlerSessionMock,
  shouldDisengageNotEnoughMoney,
  shouldDisengageRebuyRejected,
  shouldHandleViewerSession,
  shouldThrowExceptionBuyUnexpected,
} from './mocks/buyStacksHandler.mocks';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { JackpotApiClientService } from '../../jackpot.api.client/jackpot.api.client.service';
import { getSessionHash } from '../../session/session.hash';
import { handleIdleTimeoutSessionMock, shouldStartAutoplay } from './mocks/handleIdleTimeout.mocks';
import { AutoplayStatus } from './enum/autoplay.status';
import { shouldSendQueueBalance } from './mocks/handleQueueChangeOffers.mocks';
import {
  shouldSendBets,
  shouldSendBetsBetListMock,
  shouldSendBetsSessionMock
} from './mocks/handleListBets.mocks';
import {
  handleQueueChangedQueueMock, handleQueueChangedSessionMock,
  shouldAssignNewQueue, shouldThrowExceptionNotQueueStatus
} from './mocks/handleQueueChangeOfferAccepted.mocks';
import {RpcException} from "@nestjs/microservices";

jest.mock('../../logger/logger.service');
jest.mock('../../config/config.service');

describe('Player Message Service (Unit)', () => {
  let playerMessageService: PlayerMessageService;
  let monitoringsService: MonitoringWorkerClientService;
  let queueManager: QueueManagerService;
  let sessionRepository: SessionRepository;
  let machineRepository: MachineRepository;
  let rngChipPrizeRepository: RngChipPrizeRepository;
  let robotPublisher: RobotClientService;
  let workerPublisher: WorkerClientService;
  let sessionService: SessionService;
  let operatorClient: OperatorApiClientService;
  let playerPublisher: PlayerClientService;
  let jackpotClientService: JackpotApiClientService;
  let roundRepository: RoundRepository;
  let groupRepository: GroupRepository;
  let queueRepository: QueueRepository;

  beforeAll(
    async () => {
      const moduleFixture = await makeTestModule();
      playerMessageService = moduleFixture.get<PlayerMessageService>(PlayerMessageService);
      monitoringsService = moduleFixture.get<MonitoringWorkerClientService>(MonitoringWorkerClientService);
      queueManager = moduleFixture.get<QueueManagerService>(QueueManagerService);
      sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
      machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
      robotPublisher = moduleFixture.get<RobotClientService>(RobotClientService);
      workerPublisher = moduleFixture.get<WorkerClientService>(WorkerClientService);
      sessionService = moduleFixture.get<SessionService>(SessionService);
      operatorClient = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
      playerPublisher = moduleFixture.get<PlayerClientService>(PlayerClientService);
      jackpotClientService = moduleFixture.get<JackpotApiClientService>(JackpotApiClientService);
      roundRepository = moduleFixture.get<RoundRepository>(getRepositoryToken(RoundRepository, connectionNames.DATA));
      groupRepository = moduleFixture.get<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA));
      rngChipPrizeRepository = moduleFixture.get<RngChipPrizeRepository>(getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA));
      queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
    },
  );

  describe('userJoinedHandler', () => {
    it('should notify queue update', async () => {
      shouldNotifyQueueUpdate({ sessionRepository });
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');
      const queueNotifySpy = jest.spyOn(queueManager, 'notifyQueueUpdate');
      // @ts-ignore
      await playerMessageService.userJoinedHandler({ session: { id: 4, machine: { serial: '<serial>' }, queue: { id: 9000 }, status: SessionStatus.PLAYING } });
      expect(sendEventLogSpy).toBeCalledWith({
        eventType: EventType.STARTED,
        source: EventSource.GAME,
        params: {
          sessionId: 4,
          machineSerial: '<serial>',
        },
      });
      expect(queueNotifySpy).toBeCalledWith(9000, { id: 4, machine: { serial: '<serial>'}, queue: { id: 9000 }, status: 'playing' });
    });
    it('should handle reconnection', async () => {
      shouldHandleReconnect({ sessionRepository });
      const sendStopAutoplaySpy = jest.spyOn(robotPublisher, 'sendStopAutoplayMessage');
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      const startIdleSpy = jest.spyOn(workerPublisher, 'startIdleTimeout');
      // @ts-ignore
      await playerMessageService.userJoinedHandler({
        sessionId: 4,
        reconnect: true,
        session: {
          id: 4,
          // @ts-ignore
          machine: { serial: '<serial>' },
          // @ts-ignore
          queue: { id: 9000 },
          status: SessionStatus.PLAYING
        }
      }, '<corrId>');
      expect(sendStopAutoplaySpy).toBeCalledWith('<serial>', 4);
      expect(sessionUpdateSpy).toBeCalledWith(4, { status: SessionStatus.PLAYING }, expect.anything());
      expect(startIdleSpy).toBeCalledWith(4, '<corrId>');
    });
  });

  describe('userDisconnectHandler', () => {
    it('should mark session as disconnected', async () => {
      shouldMarkDisconnected({ sessionRepository });
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      // @ts-ignore
      await playerMessageService.userDisconnectHandler({ session: { id: 1, status: SessionStatus.PLAYING }, sessionId: 1 });
      expect(sessionUpdateSpy).toBeCalledWith(1, expect.objectContaining({ isDisconnected: true }));
    });
  });

  describe('buyStacksHandler', () => {
    it('should throw exception if buy is unexpected', async () => {
      shouldThrowExceptionBuyUnexpected({ sessionRepository });
      try {
        // @ts-ignore
        await playerMessageService.buyStacksHandler({ id: 1 }, 10);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(RpcException);
      }
    });
    it('should disengage robot if rebuy rejected', async () => {
      shouldDisengageRebuyRejected({ sessionRepository });
      const stopTimeoutSpy = jest.spyOn(workerPublisher, 'stopGraceTimeout');
      const sendDisengageSpy = jest.spyOn(robotPublisher, 'sendDisengageMessage');
      // @ts-ignore
      await playerMessageService.buyStacksHandler({ id: 1, machine: { serial: '<serial>' } }, 0, 0, '<corr>');
      expect(stopTimeoutSpy).toBeCalledWith(1, '<corr>');
      expect(sendDisengageSpy).toBeCalledWith(1, '<serial>');
    });
    it('should disengage robot if not enough money', async () => {
      shouldDisengageNotEnoughMoney({ sessionRepository, operatorClient, machineRepository });
      const sendNotificationSpy = jest.spyOn(playerPublisher, 'sendNotification');
      const sendDisengageSpy = jest.spyOn(robotPublisher, 'sendDisengageMessage');
      // @ts-ignore
      await playerMessageService.buyStacksHandler(buyStacksHandlerSessionMock, 5, null, '<corr>');
      expect(sendNotificationSpy).toBeCalled();
      expect(sendDisengageSpy).toBeCalledWith(1, '<serial>');
    });
    it('should handle viewer session', async () => {
      shouldHandleViewerSession({ sessionRepository, operatorClient, machineRepository, jackpotClientService });
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      const notifyBuyResultSpy = jest.spyOn(playerPublisher, 'notifyBuyResult');
      const notifyQueueUpdateSpy = jest.spyOn(queueManager, 'notifyQueueUpdate');
      // @ts-ignore
      await playerMessageService.buyStacksHandler(buyStacksHandlerSessionMock, 5, null, '<corr>');
      expect(sessionUpdateSpy).toBeCalledWith(buyStacksHandlerSessionMock.id, expect.objectContaining({
        status: SessionStatus.QUEUE,
        roundsLeft: 5,
      }), expect.anything());
      // @ts-ignore
      expect(notifyBuyResultSpy).toBeCalledWith(1, getSessionHash(buyStacksHandlerSessionMock), 5);
      expect(notifyQueueUpdateSpy).toBeCalledWith(buyStacksHandlerSessionMock.queue.id, buyStacksHandlerSessionMock);
    });
  });

  describe('enableAutoplayHandler', () => {
    it('should enable autoplay if session is in playing status', async () => {
      // @ts-ignore
      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue({
        status: SessionStatus.PLAYING,
        configuration: {},
      });
      const sendAutoplaySpy = jest.spyOn(robotPublisher, 'sendAutoplayMessage');
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      // @ts-ignore
      await playerMessageService.enableAutoplayHandler({ id: 1, machine: { serial: '<serial>' } },
        { tiltMode: 'auto' });
      expect(sendAutoplaySpy).toBeCalledWith('<serial>', 1, 'auto');
      expect(sessionUpdateSpy).toBeCalledWith(1,
        {
          status: SessionStatus.AUTOPLAY,
        }, expect.anything());
    });
  });

  describe('disableAutoplayHandler', () => {
    it('should stop autoplay', async () => {
      // @ts-ignore
      jest.spyOn(sessionRepository, 'findOneOrFail').mockResolvedValue({
        status: SessionStatus.AUTOPLAY,
        configuration: {
          // @ts-ignore
          autoplay: {},
        },
      });
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      const sendStopAutoplaySpy = jest.spyOn(robotPublisher, 'sendStopAutoplayMessage');
      const startIdleSpy = jest.spyOn(workerPublisher, 'startIdleTimeout');
      await playerMessageService.disableAutoplayHandler({
        session: {
          id: 1,
          // @ts-ignore
          machine: {serial: '<serial>'},
          // @ts-ignore
          player: {cid: '<cid>'}
        },
        correlationId: '<corr>',
      });
      expect(sendStopAutoplaySpy).toBeCalledWith('<serial>', 1);
      expect(sessionUpdateSpy).toBeCalledWith(1, { status: SessionStatus.PLAYING }, expect.anything());
      expect(startIdleSpy).toBeCalledWith(1, '<corr>');
    });
  });

    describe('handleIdleTimeout', () => {
      it('should start autoplay', async () => {
        const sessionMock = handleIdleTimeoutSessionMock;
        shouldStartAutoplay({ sessionRepository });
        const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
        const sendAutoplaySpy = jest.spyOn(robotPublisher, 'sendAutoplayMessage');
        const notifyForceAutoplaySpy = jest.spyOn(playerPublisher, 'notifyAutoplay');
        // @ts-ignore
        await playerMessageService.handleIdleTimeout({ sessionId: sessionMock.id, session: sessionMock });
        expect(sessionUpdateSpy).toBeCalledWith(sessionMock.id, { status: SessionStatus.FORCED_AUTOPLAY }, expect.anything());
        expect(sendAutoplaySpy).toBeCalledWith(sessionMock.machine.serial, sessionMock.id, TiltMode.AUTO);
        expect(notifyForceAutoplaySpy).toBeCalledWith(sessionMock.id, {
          status: AutoplayStatus.FORCED_ENABLE,
          config: {},
        });
      });
    });

    describe('handleGraceTimeout', () => {
      it('should send disengage message', async () => {
        const sendDisengageSpy = jest.spyOn(robotPublisher, 'sendDisengageMessage');
        const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');
        // @ts-ignore
        await playerMessageService.handleGraceTimeout(handleIdleTimeoutSessionMock);
        expect(sendEventLogSpy).toBeCalledWith({
          eventType: EventType.GRACE,
          source: EventSource.GAME,
          params: {
            sessionId: handleIdleTimeoutSessionMock.id,
            machineSerial: handleIdleTimeoutSessionMock.machine?.serial,
          },
        });
        expect(sendDisengageSpy).toBeCalledWith(handleIdleTimeoutSessionMock.id, handleIdleTimeoutSessionMock.machine.serial);
      });
    });

    describe('handleQueueChangeOffers', () => {
      it('should send queue balance message', async () => {
        shouldSendQueueBalance({ machineRepository });
        const queueChangeOffers = { sessionId: 10, toQueueId: 1, position: 5, session: { id: 10 } };
        const sendQueueBalanceSpy = jest.spyOn(playerPublisher, 'queueBalance');
        // @ts-ignore
        await playerMessageService.handleQueueChangeOffer(queueChangeOffers);
        expect(sendQueueBalanceSpy).toBeCalledWith(10, {
          machineId: 2,
          machineName: '<name>',
          queuePosition: 5,
        });
      });
    });

    describe('handleQueueChangeOfferAccepted', () => {
      it('should throw exception if no queue offered', async () => {
        jest.spyOn(sessionRepository, 'findOneOrFail').mockResolvedValue(new SessionEntity());
        try {
          // @ts-ignore
          await playerMessageService.handleQueueBalanceDecision({ session: handleQueueChangedSessionMock, decision: 'accept' });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeInstanceOf(RpcException);
        }
      })
      it('should throw exception if session is not in queue status', async () => {
        shouldThrowExceptionNotQueueStatus({ sessionRepository });
        try {
          // @ts-ignore
          await playerMessageService.handleQueueBalanceDecision({ session: handleQueueChangedSessionMock, decision: 'accept' });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeInstanceOf(RpcException);
        }
      });
      it('should assign session to new queue', async () => {
        shouldAssignNewQueue({ sessionRepository, queueRepository });
        const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
        const forceReconnectSpy = jest.spyOn(playerPublisher, 'forceReconnect');
        const notifyQueueUpdateSpy = jest.spyOn(queueManager, 'notifyQueueUpdate');
        // @ts-ignore
        jest.spyOn(queueManager, 'assignSessionToQueue').mockResolvedValue(handleQueueChangedSessionMock);
        // @ts-ignore
        await playerMessageService.handleQueueBalanceDecision({ session: handleQueueChangedSessionMock, decision: 'accept' });
        expect(sessionUpdateSpy).toBeCalledWith(handleQueueChangedSessionMock.id,
            {
              queue: handleQueueChangedQueueMock,
              machine: handleQueueChangedQueueMock.machine,
              group: handleQueueChangedQueueMock.machine.group,
              offeredQueueId: null,
            });
        expect(notifyQueueUpdateSpy).toBeCalledWith(handleQueueChangedSessionMock.queue.id, handleQueueChangedSessionMock);
        expect(forceReconnectSpy).toBeCalledWith(handleQueueChangedSessionMock.id);
      });
    });

    describe('handleListBets', () => {
      it('should send bets to players', async () => {
        shouldSendBets({ machineRepository, rngChipPrizeRepository });
        const sendBetsSpy = jest.spyOn(playerPublisher, 'sendBets');
        await playerMessageService.handleListBets(shouldSendBetsSessionMock);
        expect(sendBetsSpy).toBeCalledWith(shouldSendBetsSessionMock.id, shouldSendBetsBetListMock);
      });
    });
});

import { UnauthorizedException } from '@nestjs/common';
import {
  ChipRepository,
  connectionNames,
  getRepositoryToken,
  MachineDispenserRepository,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  QueueStatus,
  RngChipPrizeRepository,
  SessionRepository,
  SessionStatus,
  TiltMode,
} from 'arcadia-dal';
import { ConfigService } from '../../config/config.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { RngClientService } from '../../rng.service.client/rng.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { RoundService } from '../../round/round.service';
import { SessionService } from '../../session/session.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import {
  engageNextSessionMock,
  shouldAllowIfFromBuy,
  shouldArchiveNoFundsAvailable,
  shouldEngageFromInitial,
  shouldNotEngageEmptySession,
  shouldSkipFromBuy,
  shouldStopNoMoreSessions,
} from './mocks/engageNextSession.mocks';
import {
  handleChipPushedChipMock,
  handleChipPushedMachineMock,
  handleChipPushedPhantomSeedMock,
  shouldHandlePhantomChip,
  shouldSetChipMachine,
} from './mocks/handleChipPushed.mocks';
import {
  handleChipValidationChipMock,
  handleChipValidationMachineMock,
} from './mocks/handleChipValidation.mocks';
import { handleDisengagedSessionMock, shouldDisengagePlayer } from './mocks/handleDisengaged.mocks';
import {
  handleEngagedSessionMock,
  shouldSendAutoplaySessionDisconnected,
  shouldStartIdleNotifyQueue,
} from './mocks/handleEngaged.mocks';
import { loginRobotMachineMock, shouldReturnLoginData } from './mocks/loginRobot.mocks';
import { shouldPushChips, startSeedingMachineMock } from './mocks/startSeeding.mocks';
import { RobotMessageService } from './robot.message.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';

jest.mock('../../logger/logger.service');

describe('Robot Message Service (Unit)', () => {
  let robotMessageService: RobotMessageService;
  let machineRepository: MachineRepository;
  let configService: ConfigService;
  let queueRepository: QueueRepository;
  let sessionRepository: SessionRepository;
  let monitoringsService: MonitoringWorkerClientService;
  let workerPublisher: WorkerClientService;
  let robotClientService: RobotClientService;
  let chipRepository: ChipRepository;
  let rngService: RngClientService;
  let dispenserRepository: MachineDispenserRepository;
  let queueManager: QueueManagerService;
  let operatorClient: OperatorApiClientService;
  let sessionService: SessionService;
  let roundService: RoundService;
  let rngChipPrizeRepository: RngChipPrizeRepository;

  beforeAll(
    async () => {
      const moduleFixture = await makeTestModule();
      robotMessageService = moduleFixture.get<RobotMessageService>(RobotMessageService);
      machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
      configService = moduleFixture.get<ConfigService>(ConfigService);
      queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
      sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
      monitoringsService = moduleFixture.get<MonitoringWorkerClientService>(MonitoringWorkerClientService);
      workerPublisher = moduleFixture.get<WorkerClientService>(WorkerClientService);
      robotClientService = moduleFixture.get<RobotClientService>(RobotClientService);
      chipRepository = moduleFixture.get<ChipRepository>(getRepositoryToken(ChipRepository, connectionNames.DATA));
      rngService = moduleFixture.get<RngClientService>(RngClientService);
      dispenserRepository = moduleFixture
        .get<MachineDispenserRepository>(getRepositoryToken(MachineDispenserRepository, connectionNames.DATA));
      queueManager = moduleFixture.get<QueueManagerService>(QueueManagerService);
      operatorClient = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
      sessionService = moduleFixture.get<SessionService>(SessionService);
      roundService = moduleFixture.get<RoundService>(RoundService);
      rngChipPrizeRepository = moduleFixture.get<RngChipPrizeRepository>(getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA));
    });

  describe('loginRobot', () => {
    it('should throw exception if machine is not found', async () => {
      try {
        await robotMessageService.loginRobot('<serial>', '<secret>');
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should return login data', async () => {
      shouldReturnLoginData({ machineRepository, configService, queueRepository });
      const result = await robotMessageService.loginRobot(loginRobotMachineMock.serial, '<secret>');
      expect(result).toMatchObject({
        robotKey: loginRobotMachineMock.id,
        mgrMessageServer: '<user>:<password>@<host>:<port>',
        queues: ServerRMQ.getConnectors(loginRobotMachineMock.serial),
        playerMessageServer: {
          url: '<redisHost>',
          port: '<port>',
          key: 'socket.io',
        },
      });
    });
  });

  describe('handleDisengaged', () => {
    it('should disengage player', async () => {
      shouldDisengagePlayer({ sessionRepository, machineRepository, robotMessageService });
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');
      const stopIdleSpy = jest.spyOn(workerPublisher, 'stopIdleTimeout');
      const stopGraceSpy = jest.spyOn(workerPublisher, 'stopGraceTimeout');
      // @ts-ignore
      await robotMessageService.handleDisengaged({
        session: handleDisengagedSessionMock,
        serial: '<serial>',
        type: '',
      });
      expect(sendEventLogSpy).toBeCalledWith(handleDisengagedSessionMock, {
        eventType: EventType.BREAKUP,
        source: EventSource.ROBOT,
        params: {},
      });
      expect(stopIdleSpy).toBeCalledWith(handleDisengagedSessionMock.id, undefined);
      expect(stopGraceSpy).toBeCalledWith(handleDisengagedSessionMock.id, undefined);
    });
  });

  describe('handleOutOfChips', () => {
    it('should stop current session', async () => {
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      const sendStopSpy = jest.spyOn(robotClientService, 'sendStopMessage');
      const outOfSessionSpy = jest.spyOn(monitoringsService, 'sendOutOfSessionEventLogMessage');
      await robotMessageService.handleOutOfChips('<serial>');
      expect(machineUpdateSpy).toBeCalledWith({ serial: '<serial>' }, { status: MachineStatus.SHUTTING_DOWN });
      expect(sendStopSpy).toBeCalledWith('<serial>');
      expect(outOfSessionSpy).toBeCalledWith('<serial>', {
        eventType: EventType.STOPPING,
        source: EventSource.GAME,
        params: {},
      });
    });
  });

  describe('handleChipValidation', () => {
    it('should validate chip', async () => {
      const sendChipValidationSpy = jest.spyOn(robotClientService, 'sendChipValidationMessage');
      // @ts-ignore
      jest.spyOn(rngChipPrizeRepository, 'getChipPrize').mockResolvedValue({ chipValue: 5 });
      // @ts-ignore
      jest.spyOn(machineRepository, 'findOneOrFail').mockResolvedValue(handleChipValidationMachineMock);
      // @ts-ignore
      jest.spyOn(chipRepository, 'findOne').mockResolvedValue(handleChipValidationChipMock);
      await robotMessageService.handleChipValidation(handleChipValidationMachineMock.serial, '<rfid>');
      expect(sendChipValidationSpy).toBeCalledWith('<rfid>', true, handleChipValidationMachineMock.serial);
    });
  });

  describe('handleChipPushed', () => {
    it('should set chip\'s machine', async () => {
      shouldSetChipMachine({ machineRepository, chipRepository });
      // @ts-ignore
      jest.spyOn(rngChipPrizeRepository, 'getChipPrize').mockResolvedValue({ chipValue: 5 });
      const chipUpdateSpy = jest.spyOn(chipRepository, 'update');
      await robotMessageService.handleChipPushed(handleChipPushedMachineMock.serial, handleChipPushedChipMock.rfid, 5);
      expect(chipUpdateSpy).toBeCalledWith(handleChipPushedChipMock.rfid, {
        isScatter: false,
        machine: handleChipPushedMachineMock,
        value: 5,
      });
    });
    it('should handle phantom chip push', async () => {
      shouldHandlePhantomChip({ machineRepository, chipRepository, rngService });
      const chipUpdateSpy = jest.spyOn(chipRepository, 'update');
      await robotMessageService.handleChipPushed(handleChipPushedMachineMock.serial, handleChipPushedChipMock.rfid, 5);
      expect(chipUpdateSpy).toBeCalledWith(handleChipPushedChipMock.rfid, {
        machine: handleChipPushedMachineMock,
        value: handleChipPushedPhantomSeedMock.value,
        isScatter: true,
      });
    });
    it('should decrement dispenser level', async () => {
      shouldSetChipMachine({ machineRepository, chipRepository });
      const levelDecrementSpy = jest.spyOn(dispenserRepository, 'decrement');
      await robotMessageService.handleChipPushed(handleChipPushedMachineMock.serial, handleChipPushedChipMock.rfid, 5);
      expect(levelDecrementSpy).toBeCalledWith({ id: 'x' }, 'level', 1);
    });
  });

  describe('engageNextSession', () => {
    it('should stop machine if no more sessions and queue is drying', async () => {
      shouldStopNoMoreSessions({ queueManager, sessionRepository });
      const queueUpdateSpy = jest.spyOn(queueRepository, 'update');
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      const sendStopMessageSpy = jest.spyOn(robotClientService, 'sendStopMessage');
      const forceChangeMachineSpy = jest.spyOn(queueManager, 'forceChangeMachine');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.DRYING }, true);

      expect(queueUpdateSpy).toBeCalledWith(11, { status: QueueStatus.STOPPED });
      expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.SHUTTING_DOWN });
      expect(sendStopMessageSpy).toBeCalledWith('<serial>');
      expect(forceChangeMachineSpy).toBeCalledWith([1, 2], 21, [1]);
    });
    it('should mark machine as ready if no more sessions', async () => {
      shouldStopNoMoreSessions({ queueManager, sessionRepository });
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      const notifyQueueUpdateSpy = jest.spyOn(queueManager, 'notifyQueueUpdate');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.IN_PLAY }, false);

      expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.READY });
      expect(notifyQueueUpdateSpy).toBeCalledWith(11);
    });
    it('should not engage empty sessions', async () => {
      shouldNotEngageEmptySession({ sessionRepository, queueManager });
      const wagerSpy = jest.spyOn(operatorClient, 'bet');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.IN_PLAY }, false);

      expect(wagerSpy).not.toBeCalled();
    });
    it('should skip if from buy and the buy session is not ahead of the queue', async () => {
      shouldSkipFromBuy({ sessionRepository, queueManager });
      const wagerSpy = jest.spyOn(operatorClient, 'bet');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.IN_PLAY }, true);

      expect(wagerSpy).not.toBeCalled();
    });
    it('should archive session if no funds available', async () => {
      shouldArchiveNoFundsAvailable({ sessionRepository, queueManager, operatorClient });
      const sessionSaveArchiveSpy = jest.spyOn(sessionService, 'saveAndArchive');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.IN_PLAY }, false);

      expect(sessionSaveArchiveSpy).toBeCalledWith(engageNextSessionMock);
    });
    it('should send allow coins if from buy', async () => {
      shouldAllowIfFromBuy({
        sessionRepository, queueManager, operatorClient, roundService,
      });
      const sendAllowCoinsSpy = jest.spyOn(robotClientService, 'sendAllowCoinsMessage');
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');

      // @ts-ignore
      await robotMessageService.engageNextSession({
        id: 1,
        serial: '<serial>',
        group: { id: 21 },
      }, { id: 11, status: QueueStatus.IN_PLAY }, { id: 2 });

      expect(sendAllowCoinsSpy).toBeCalledWith(10, '<serial>', 2);
      expect(sendEventLogSpy).toBeCalledWith({
        ...engageNextSessionMock,
        machine: { id: 1, serial: '<serial>', group: { id: 21 } },
        totalStacksUsed: 20,
      }, {
        eventType: EventType.ALLOW,
        source: EventSource.GAME,
        params: {
          coins: 10,
        },
      });
    });
    it('should engage robot if from initial buy', async () => {
      shouldEngageFromInitial({
        sessionRepository, queueManager, operatorClient, roundService,
      });
      const sendEngageSpy = jest.spyOn(robotClientService, 'sendEngageMessage');
      const sendEngageTimeoutSpy = jest.spyOn(workerPublisher, 'startEngageTimeout');
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');

      await robotMessageService
        // @ts-ignore
        .engageNextSession({ id: 1, serial: '<serial>', group: { id: 21 } }, {
            id: 11,
            status: QueueStatus.IN_PLAY,
          }, { id: 2 },
          '<corr>');

      expect(sendEngageSpy).toBeCalledWith(engageNextSessionMock.id, '<serial>');
      expect(sendEngageTimeoutSpy).toBeCalledWith(engageNextSessionMock.id, '<corr>');
      expect(sendEventLogSpy).toBeCalledWith({
        ...engageNextSessionMock,
        machine: { id: 1, serial: '<serial>', group: { id: 21 } },
        totalStacksUsed: 0,
      }, {
        eventType: EventType.ENGAGE_ROBOT,
        source: EventSource.GAME,
        params: {},
      });
    });
    it('should engage robot if from seed', async () => {
      shouldEngageFromInitial({
        sessionRepository, queueManager, operatorClient, roundService,
      });
      const sendEngageSpy = jest.spyOn(robotClientService, 'sendEngageMessage');
      const sendEngageTimeoutSpy = jest.spyOn(workerPublisher, 'startEngageTimeout');
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');

      await robotMessageService
        // @ts-ignore
        .engageNextSession({ id: 1, serial: '<serial>', group: { id: 21 } }, {
            id: 11,
            status: QueueStatus.IN_PLAY,
          }, null,
          '<corr>');

      expect(sendEngageSpy).toBeCalledWith(engageNextSessionMock.id, '<serial>');
      expect(sendEngageTimeoutSpy).toBeCalledWith(engageNextSessionMock.id, '<corr>');
      expect(sendEventLogSpy).toBeCalledWith({
        ...engageNextSessionMock,
        machine: { id: 1, serial: '<serial>', group: { id: 21 } },
        totalStacksUsed: 0,
      }, {
        eventType: EventType.ENGAGE_ROBOT,
        source: EventSource.GAME,
        params: {},
      });
    });
  });

  describe('handleEngaged', () => {
    it('should send autoplay message if session is disconnected', async () => {
      shouldSendAutoplaySessionDisconnected({ sessionRepository });
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update');
      const sendAutoplaySpy = jest.spyOn(robotClientService, 'sendAutoplayMessage');
      await robotMessageService.handleEngaged({
        // @ts-ignore
        session: handleEngagedSessionMock,
      });
      expect(sessionUpdateSpy).toBeCalledWith(handleEngagedSessionMock.id, { status: SessionStatus.FORCED_AUTOPLAY });
      expect(sendAutoplaySpy).toBeCalledWith(handleEngagedSessionMock.machine.serial, handleEngagedSessionMock.id, TiltMode.AUTO);
    });
    it('should start idle timeout and notify about queue status', async () => {
      shouldStartIdleNotifyQueue({ sessionRepository });
      const sendEngageTimeoutSpy = jest.spyOn(workerPublisher, 'stopEngageTimeout');
      const sendAllowCoinsSpy = jest.spyOn(robotClientService, 'sendAllowCoinsMessage');
      const sessionUpdateSpy = jest.spyOn(sessionRepository, 'update').mockReset();
      const startIdleTimeoutSpy = jest.spyOn(workerPublisher, 'startIdleTimeout');
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');
      const notifyQueueSpy = jest.spyOn(queueManager, 'notifyQueueUpdate');

      await robotMessageService.handleEngaged({
        // @ts-ignore
        session: handleEngagedSessionMock,
      });

      expect(sendEngageTimeoutSpy).toBeCalledWith(handleEngagedSessionMock.id, undefined);
      expect(sendAllowCoinsSpy).toBeCalledWith(10, handleEngagedSessionMock.machine.serial, handleEngagedSessionMock.id);
      expect(sessionUpdateSpy).toBeCalledTimes(2);
      expect(startIdleTimeoutSpy).toBeCalledWith(handleEngagedSessionMock.id, handleEngagedSessionMock.player.cid, undefined);
      expect(sendEventLogSpy).toBeCalledWith(handleEngagedSessionMock, {
        eventType: EventType.ENGAGED,
        source: EventSource.ROBOT,
        params: {},
      });
      expect(notifyQueueSpy).toBeCalledWith(handleEngagedSessionMock.queue.id);
    });
  });

  describe('startSeeding', () => {
    it('should push chips', async done => {
      shouldPushChips({ machineRepository, rngService });
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      const sendPushSpy = jest.spyOn(robotClientService, 'sendPushMessage');
      const gameEventLogSpy = jest.spyOn(monitoringsService, 'sendOutOfSessionEventLogMessage');

      // @ts-ignore
      await robotMessageService.seeding(startSeedingMachineMock, ['a', 'b']);

      setTimeout(() => {
        expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.SEEDING });
        expect(gameEventLogSpy).toBeCalledWith(startSeedingMachineMock.serial, {
          source: EventSource.GAME,
          eventType: EventType.TABLE,
          params: {},
        });
        expect(sendPushSpy).toBeCalledWith('d1', startSeedingMachineMock.serial);
        expect(gameEventLogSpy).toBeCalledWith(startSeedingMachineMock.serial, {
          source: EventSource.GAME,
          eventType: EventType.PUSH,
          params: {},
        });
        done();
      }, 2000);
    });
  });
});

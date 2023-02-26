import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken, GroupRepository,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  RngChipPrizeRepository, SessionRepository, SiteRepository,
} from 'arcadia-dal';
import { makeTestModule } from './mocks/bo.handlerBeforeAll.mock';
import { BoHandlerService } from './bo.handler.service';
import { QueueManagerService } from '../queue.manager/queue.manager.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { GroupTerminatorService } from '../group.terminator/group.terminator.service';
import { shouldThrowExceptionMachineCannotStart, shouldUpdateMachineSendRun } from './mocks/machineStartHandler.mocks';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';
import {
  shouldReassignMachine,
  shouldThrowExceptionChipIncompatible,
  shouldThrowExceptionGroupNotFound,
  shouldThrowExceptionMachineNotFound,
  shouldThrowExceptionMachineOffline,
  shouldThrowExceptionSameGroup
} from './mocks/machineReassign.mocks';
import { RobotMessageService } from '../messaging/robot.handling/robot.message.service';
import { shouldHardStopReboot, shouldThrowExceptionMachineInPlay } from './mocks/machineReboot.mocks';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { BusEventType } from '../event.bus/bus.event.type';
import { shouldProvideVideoToken } from './mocks/getVideoApiToken.mocks';
import { VideoApiClientService } from '../video.api.client/video.api.client.service';

jest.mock('../logger/logger.service');
jest.mock('../config/config.service');

describe('Bo Handler Service (Unit)', () => {
  let boHandlerService: BoHandlerService;
  let machineRepository: MachineRepository;
  let queueRepository: QueueRepository;
  let queueManager: QueueManagerService;
  let groupRepository: GroupRepository;
  let siteRepository: SiteRepository;
  let robotClient: RobotClientService;
  let operatorClient: OperatorApiClientService;
  let sessionRepository: SessionRepository;
  let groupTerminator: GroupTerminatorService;
  let rngPrizeRepository: RngChipPrizeRepository;
  let robotMessaging: RobotMessageService;
  let eventBusPublisher: EventBusPublisher;
  let videoApiService: VideoApiClientService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    boHandlerService = moduleFixture.get<BoHandlerService>(BoHandlerService);
    queueManager = moduleFixture.get<QueueManagerService>(QueueManagerService);
    machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
    queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
    groupRepository = moduleFixture.get<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA));
    rngPrizeRepository = moduleFixture.get<RngChipPrizeRepository>(getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA));
    siteRepository = moduleFixture.get<SiteRepository>(getRepositoryToken(SiteRepository, connectionNames.DATA));
    robotClient = moduleFixture.get<RobotClientService>(RobotClientService);
    operatorClient = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
    sessionRepository = moduleFixture.get<SessionRepository>(SessionRepository);
    groupTerminator = moduleFixture.get<GroupTerminatorService>(GroupTerminatorService);
    robotMessaging = moduleFixture.get<RobotMessageService>(RobotMessageService);
    eventBusPublisher = moduleFixture.get<EventBusPublisher>(EventBusPublisher);
    videoApiService = moduleFixture.get<VideoApiClientService>(VideoApiClientService);
  });

  describe('groupSoftStopHandler', () => {
    it('should call group terminator method', async () => {
      const softStopSpy = jest.spyOn(groupTerminator, 'groupSoftStop');
      await boHandlerService.groupSoftStopHandler(1, [1], '<id>');
      expect(softStopSpy).toBeCalledWith(1, [1], '<id>');
    });
  });

  describe('groupHardStopHandler', () => {
    it('should call group terminator method', async () => {
      const hardStopSpy = jest.spyOn(groupTerminator, 'groupHardStop');
      await boHandlerService.groupHardStopHandler(1, [1], '<id>');
      expect(hardStopSpy).toBeCalledWith(1, [1], '<id>');
    });
  });

  describe('machineStartHandler', () => {
    it('should throw exception if machine cannot be started from it\'s status', async () => {
      shouldThrowExceptionMachineCannotStart({ machineRepository });
      try {
        await boHandlerService.machineStartHandler(1, { resetTableState: false, resetDispensers: false });
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
    it('should update machine status and send run command', async () => {
      shouldUpdateMachineSendRun({ machineRepository });
      const updateSpy = jest.spyOn(machineRepository, 'update');
      const sendRunSpy = jest.spyOn(robotClient, 'sendRobotMessage');
      await boHandlerService.machineStartHandler(1, { resetTableState: false, resetDispensers: false });
      expect(updateSpy).toBeCalledWith(1,  expect.objectContaining({ status: MachineStatus.STOPPED }));
      expect(sendRunSpy).toBeCalledWith({ action: CoreMessage.RUN }, '<serial>')
    });
  });

  describe('machineReassign', () => {
    it('should throw exception if machine is not found', async () => {
      shouldThrowExceptionMachineNotFound({ machineRepository });
      try {
        await boHandlerService.machineReassign(1, 1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    it('should throw exception if group is not found', async () => {
      shouldThrowExceptionGroupNotFound({ machineRepository, groupRepository });
      try {
        await boHandlerService.machineReassign(1, 1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    it('should throw exception if reassigned to same group', async () => {
      shouldThrowExceptionSameGroup({ machineRepository, groupRepository });
      try {
        await boHandlerService.machineReassign(1, 1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
    it('should throw exception if machine is offline', async () => {
      shouldThrowExceptionMachineOffline({ machineRepository, groupRepository });
      try {
        await boHandlerService.machineReassign(1, 1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
    it('should throw exception if chip types are incompatible', async () => {
      shouldThrowExceptionChipIncompatible({ machineRepository, groupRepository, rngPrizeRepository });
      try {
        await boHandlerService.machineReassign(1, 1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
    it('should reassign machine', async () => {
      shouldReassignMachine({ machineRepository, groupRepository, rngPrizeRepository });
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      const reassignSpy = jest.spyOn(robotMessaging, 'reassignMachine');
      await boHandlerService.machineReassign(1, 1);
      expect(machineUpdateSpy).toBeCalledWith(1, { reassignTo: 1 });
      expect(reassignSpy).toBeCalledWith(1);
    });
  });

  describe('machineReboot', () => {
    it('should throw exception if machine is in play', async () => {
      shouldThrowExceptionMachineInPlay({ machineRepository });
      try {
        await boHandlerService.machineReboot(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
    it('should call hard stop method and send reboot message', async () => {
      shouldHardStopReboot({ machineRepository });
      const hardStopSpy = jest.spyOn(groupTerminator, 'groupHardStop');
      const sendRebootSpy = jest.spyOn(robotClient, 'sendRobotMessage');
      await boHandlerService.machineReboot(1);
      expect(hardStopSpy).toBeCalledWith(2, [1]);
      expect(sendRebootSpy).toBeCalledWith({ action: CoreMessage.REBOOT }, '<serial>');
    });
  });

  describe('terminateSession', () => {
    it('should send terminate session event', async () => {
      const terminateSpy = jest.spyOn(eventBusPublisher, 'terminateSession');
      await boHandlerService.terminateSession(64, '<corr>');
      expect(terminateSpy).toBeCalledWith({
        type: BusEventType.TERMINATE_SESSION,
        sessionId: 64,
        correlationId: '<corr>',
        terminate: true,
      });
    });
  });

  describe('getVideoApiToken', () => {
    it('should provide video api token', async () => {
      shouldProvideVideoToken({ siteRepository, videoApiService });
      const apiTokenSpy = jest.spyOn(videoApiService, 'getApiToken');
      await boHandlerService.getVideoApiToken(16);
      expect(apiTokenSpy).toBeCalledWith({ id: 16 });
    });
  });
});
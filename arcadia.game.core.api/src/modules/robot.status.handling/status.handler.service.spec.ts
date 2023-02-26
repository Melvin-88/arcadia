import {
  ChipRepository,
  connectionNames,
  getRepositoryToken,
  MachineRepository,
  MachineStatus,
  QueueRepository,
  QueueStatus,
} from 'arcadia-dal';
import { StatusHandlerService } from './status.handler.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import { RobotReportedStatus } from './robot.reported.status';
import { BoHandlerService } from '../bo.handler/bo.handler.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { RobotMessageService } from '../messaging/robot.handling/robot.message.service';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';
import { seedingStrategyOnIdleMachineMock, shouldSendChipMapStartSeeding } from './mocks/seedingStrategyOnIdle.mocks';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';

jest.mock('../logger/logger.service');

describe('Status Handler Service (Unit)', () => {
  let statusHandlerService: StatusHandlerService;
  let machineRepository: MachineRepository;
  let boHandler: BoHandlerService;
  let queueRepository: QueueRepository;
  let chipRepository: ChipRepository;
  let robotClientService: RobotClientService;
  let robotMessageService: RobotMessageService;
  let monitoringWorkerClientService: MonitoringWorkerClientService;
  let machineUpdateSpy: any;
  let sendRobotMessageSpy: any;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    statusHandlerService = moduleFixture.get<StatusHandlerService>(StatusHandlerService);
    machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
    boHandler = moduleFixture.get<BoHandlerService>(BoHandlerService);
    queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
    robotClientService = moduleFixture.get<RobotClientService>(RobotClientService);
    chipRepository = moduleFixture.get<ChipRepository>(getRepositoryToken(ChipRepository, connectionNames.DATA));
    robotMessageService = moduleFixture.get<RobotMessageService>(RobotMessageService);
    monitoringWorkerClientService = moduleFixture.get<MonitoringWorkerClientService>(MonitoringWorkerClientService);

    // @ts-ignore
    jest.spyOn(machineRepository, 'findOneOrFail').mockResolvedValue({ id: 1, group: { id: 11 } });
    machineUpdateSpy = jest.spyOn(machineRepository, 'update');
    sendRobotMessageSpy = jest.spyOn(robotClientService, 'sendRobotMessage');
  });

  describe('handleStatus', () => {
    it('should update ping date', async () => {
      const currentDate = new Date('2019-05-14T11:01:58.135Z');
      const realDate = Date;
      // @ts-ignore
      global.Date = class extends Date {
        constructor(date) {
          if (date) {
            // @ts-ignore
            return super(date);
          }

          return currentDate;
        }
      };
      await statusHandlerService.handleStatus('unknown' as RobotReportedStatus, '<serial>');
      expect(machineUpdateSpy).toBeCalledWith(1, { pingDate: currentDate });
      global.Date = realDate;
    });
    it('should stop machine for any status in error strategy', async () => {
      const groupStopSpy = jest.spyOn(boHandler, 'groupHardStopHandler');
      await statusHandlerService.handleStatus(RobotReportedStatus.IDLE, '<serial>');
      expect(groupStopSpy).toBeCalledWith(11, [1]);
      await statusHandlerService.handleStatus(RobotReportedStatus.STOPPED, '<serial>');
      expect(groupStopSpy).toBeCalledWith(11, [1]);
      await statusHandlerService.handleStatus(RobotReportedStatus.TESTING, '<serial>');
      expect(groupStopSpy).toBeCalledWith(11, [1]);
      await statusHandlerService.handleStatus(RobotReportedStatus.STOPPING, '<serial>');
      expect(groupStopSpy).toBeCalledWith(11, [1]);
    });
    it('should update machine status in shutdown strategy, onStopped', async () => {
      // @ts-ignore
      jest.spyOn(machineRepository, 'findOneOrFail').mockResolvedValueOnce({ id: 1, status: MachineStatus.SHUTTING_DOWN, group: { id: 11 } });
      await statusHandlerService.handleStatus(RobotReportedStatus.STOPPED, '<serial>');
      expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.ON_HOLD });
    });
    it('should send chipmap and start seedind in startup strategy, onIdle', async () => {
      shouldSendChipMapStartSeeding({ machineRepository, chipRepository });
      const queueUpdateSpy = jest.spyOn(queueRepository, 'update');
      const sendRobotMessageSpy = jest.spyOn(robotClientService, 'sendRobotMessage');
      const startSeedingSpy = jest.spyOn(robotMessageService, 'seeding');
      await statusHandlerService.handleStatus(RobotReportedStatus.IDLE, '<serial>');
      expect(queueUpdateSpy).toBeCalledWith({ machine: { id: 1 } },
        { status: QueueStatus.READY });
      expect(sendRobotMessageSpy).toBeCalledWith({
        map: { d1: ['<rfid>'] },
        action: CoreMessage.CHIP_MAP,
      }, '<serial>');
      expect(startSeedingSpy).toBeCalledWith(seedingStrategyOnIdleMachineMock, []);
    });
    it('should update machine status in startup strategy, onTesting', async () => {
      // @ts-ignore
      jest.spyOn(machineRepository, 'findOneOrFail').mockResolvedValueOnce({ id: 1, status: MachineStatus.STOPPED });
      const machineUpdateSpy = jest.spyOn(machineRepository, 'update');
      await statusHandlerService.handleStatus(RobotReportedStatus.TESTING, '<serial>');
      expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.PREPARING });
    });
    it('should update db status and send run message in startup strategy, onStopped', async () => {
      // @ts-ignore
      jest.spyOn(machineRepository, 'findOneOrFail').mockResolvedValueOnce({ id: 1, serial: '<serial>', status: MachineStatus.STOPPED });
      const sendEventLogSpy = jest.spyOn(monitoringWorkerClientService, 'sendOutOfSessionEventLogMessage');
      await statusHandlerService.handleStatus(RobotReportedStatus.STOPPED, '<serial>');
      expect(machineUpdateSpy).toBeCalledWith(1, { status: MachineStatus.STOPPED });
      expect(sendRobotMessageSpy).toBeCalledWith({ action: CoreMessage.RUN }, '<serial>');
      expect(sendEventLogSpy).toBeCalledWith('<serial>', {
        eventType: EventType.RUN,
        source: EventSource.GAME,
        params: {},
      },
      );
    });
  });
});
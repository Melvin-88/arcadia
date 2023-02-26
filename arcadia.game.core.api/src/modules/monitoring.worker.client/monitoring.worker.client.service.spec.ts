import { makeTestModule, rmqServerMock } from './mocks/beforeAll.mock';
import { MonitoringWorkerClientService } from './monitoring.worker.client.service';
import { EventSource, EventType, MonitoringWorkerMessage } from './enum';
import { CORE_TO_MONITORING_WORKER_QUEUE } from '../../constants/rabbit.constants';

jest.mock('../logger/logger.service');

describe('Monitoring Worker Client Service (Unit)', () => {
  let monitoringWorkerClientService: MonitoringWorkerClientService;

  beforeAll(
    async () => {
      const moduleFixture = await makeTestModule();
      monitoringWorkerClientService = moduleFixture.get<MonitoringWorkerClientService>(MonitoringWorkerClientService);
      await monitoringWorkerClientService.onModuleInit();
    },
  );

  describe('sendWorkerMessage', () => {
    it('should send message to worker using rabbitMQ', async () => {
      const sendMessageSpy = jest.spyOn(rmqServerMock, 'sendMessage');
      const message = {
        eventType: EventType.ALLOW,
        params: { machineSerial: '<serial>' },
        source: EventSource.GAME,
        type: MonitoringWorkerMessage.EVENT_LOG,
      };

      await monitoringWorkerClientService.sendWorkerMessage(message);

      expect(sendMessageSpy).toBeCalledWith(message, CORE_TO_MONITORING_WORKER_QUEUE);
    });
  });

  describe('sendEventLogMessage', () => {
    it('should send event log message', async () => {
      const session = {
        id: 2,
        machine: {
          serial: '<serial>',
        },
        player: {
          cid: '<cid>',
        },
      };
      const eventLogData = {
        source: EventSource.GAME,
        eventType: EventType.ALLOW,
        params: {},
      };
      const sendMessageSpy = jest.spyOn(monitoringWorkerClientService, 'sendWorkerMessage');

      // @ts-ignore
      await monitoringWorkerClientService.sendEventLogMessage(session, eventLogData);
      expect(sendMessageSpy).toBeCalledWith({
        type: MonitoringWorkerMessage.EVENT_LOG,
        source: eventLogData.source,
        eventType: eventLogData.eventType,
        params: {
          sessionId: session.id,
          machineSerial: session.machine.serial,
          playerCid: session.player.cid,
          ...eventLogData.params,
        },
      });
    });
  });

  describe('sendOutOfSessionEventLogMessage', () => {
    it('should send event log message', async () => {
      const eventLogData = {
        source: EventSource.GAME,
        eventType: EventType.ALLOW,
        params: {},
      };
      const sendMessageSpy = jest.spyOn(monitoringWorkerClientService, 'sendWorkerMessage');

      // @ts-ignore
      await monitoringWorkerClientService.sendOutOfSessionEventLogMessage('<serial>', eventLogData);
      expect(sendMessageSpy).toBeCalledWith({
        type: MonitoringWorkerMessage.EVENT_LOG,
        source: eventLogData.source,
        eventType: eventLogData.eventType,
        params: {
          machineSerial: '<serial>',
        },
      });
    });
  });
});
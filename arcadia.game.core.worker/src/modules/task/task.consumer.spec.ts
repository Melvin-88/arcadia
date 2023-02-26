import {
  connectionNames,
  getRepositoryToken,
  GroupRepository, LessThan,
  MachineEntity,
  MachineRepository,
  QueueRepository,
  SessionRepository, VoucherRepository,
  VoucherStatus,
} from 'arcadia-dal';
import { Job } from 'bull';
import { TO_QUEUE } from '../../constants/rabbit.constants';
import { ServerRMQ } from '../../rabbitMQ.strategy';
import { CoreClientService } from '../coreClient/coreClient.service';
import { findQueuesByIdMock, shouldSendUpdateQueueStatus } from '../coreClient/mocks/updateQueueStatus.mocks';
import { makeTestModule, taskConsumerRmqServerMock } from './mocks/beforeAll.task.consumer.mock';
import { TaskConsumer } from './task.consumer';

jest.mock('../logger/logger.service');

describe('Task Consumer (Unit)', () => {
  let taskConsumer: TaskConsumer;
  let machineRepository: MachineRepository;
  let groupRepository: GroupRepository;
  let sessionRepository: SessionRepository;
  let queueRepository: QueueRepository;
  let coreClientService: CoreClientService;
  let voucherRepository: VoucherRepository;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    taskConsumer = moduleFixture.get<TaskConsumer>(TaskConsumer);
    machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
    groupRepository = moduleFixture.get<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA));
    sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
    queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
    voucherRepository = moduleFixture.get<VoucherRepository>(getRepositoryToken(VoucherRepository, connectionNames.DATA));
    coreClientService = moduleFixture.get<CoreClientService>(CoreClientService);
    await taskConsumer.onModuleInit();
  });

  describe('pingRobot', () => {
    it('should send ping message to machines', async () => {
      const machineMocks = [new MachineEntity(), new MachineEntity()];
      machineMocks[0].serial = '<ser1>';
      machineMocks[1].serial = '<ser2>';
      jest.spyOn(machineRepository, 'getMachinesToPing').mockResolvedValue(machineMocks);
      const sendPingSpy = jest.spyOn(taskConsumerRmqServerMock, 'sendMessage');
      await taskConsumer.pingRobot({ data: {}, opts: { repeat: 10 } } as unknown as Job);
      expect(sendPingSpy).toBeCalledWith({ action: 'ping' }, ServerRMQ.getQueueName(TO_QUEUE, machineMocks[0].serial));
      expect(sendPingSpy).toBeCalledWith({ action: 'ping' }, ServerRMQ.getQueueName(TO_QUEUE, machineMocks[1].serial));
    });
  });

  describe('expireVouchers', () => {
    it('should update expired unused pending vouchers', async () => {
      const voucherUpdateSpy = jest.spyOn(voucherRepository, 'update');
      await taskConsumer.expireVouchers({} as Job);
      expect(voucherUpdateSpy).toBeCalledWith(expect.objectContaining({
        status: VoucherStatus.PENDING,
        session: null,
      }), { status: VoucherStatus.EXPIRED });
    });
  });

  describe('updateQueuesStatus', () => {
    it('should send update queue status message', async () => {
      shouldSendUpdateQueueStatus({ groupRepository, queueRepository });
      const saveSessionSpy = jest.spyOn(sessionRepository, 'save');
      const sendQueueOfferSpy = jest.spyOn(coreClientService, 'sendQueueChangeOfferMessage');
      await taskConsumer.queueBalance({ data: { timeout: 10 } } as Job);
      expect(saveSessionSpy).toBeCalledWith([findQueuesByIdMock[0].sessions[3]], { reload: false, transaction: false });
      expect(sendQueueOfferSpy).toBeCalledWith({ position: 2, sessionId: 42, toQueueId: 1 }, expect.any(String));
    });
  });

  describe('idleTimeout', () => {
    it('should send idle timeout message', async () => {
      const sendIdleSpy = jest.spyOn(coreClientService, 'sendIdleTimeoutMessage');
      await taskConsumer.idleTimeout({ data: { sessionId: 1 } } as Job);
      expect(sendIdleSpy).toBeCalledWith(1, expect.any(String));
    });
  });

  describe('graceTimeout', () => {
    it('should send grace timeout message', async () => {
      const sendGraceSpy = jest.spyOn(coreClientService, 'sendGraceTimeoutMessage');
      await taskConsumer.graceTimeout({ data: { sessionId: 1 } } as Job);
      expect(sendGraceSpy).toBeCalledWith(1, expect.any(String));
    });
  });

  describe('engageTimeout', () => {
    it('should send engage timeout message', async () => {
      const sendEngageSpy = jest.spyOn(coreClientService, 'sendEngageTimeoutMessage');
      await taskConsumer.engageTimeout({ data: { sessionId: 1 } } as Job);
      expect(sendEngageSpy).toBeCalledWith(1, expect.any(String));
    });
  });

  describe('jackpotReloginTimeout', () => {
    it('should send jackpot relogin timeout message', async () => {
      const sendJackpotSpy = jest.spyOn(coreClientService, 'sendJackpotReloginTimeoutMessage');
      await taskConsumer.jackpotReloginTimeout({ data: {} } as Job);
      expect(sendJackpotSpy).toBeCalledWith(expect.any(String));
    });
  });

  describe('roundEndDelay', () => {
    it('should send round end delay message', async () => {
      const sendRoundDelaySpy = jest.spyOn(coreClientService, 'sendRoundEndDelayMessage');
      await taskConsumer.roundEndDelay({ data: { timeout: 30 } } as Job);
      expect(sendRoundDelaySpy).toBeCalledWith(expect.objectContaining({
        timeout: 30,
      }));
    });
  });
});

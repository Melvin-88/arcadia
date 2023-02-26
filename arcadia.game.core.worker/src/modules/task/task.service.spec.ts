import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, Timeout } from '../enum';
import { jobMock, makeTestModule } from './mocks/beforeAll.task.service';
import { TaskService } from './task.service';

jest.mock('../logger/logger.service');

describe('Task Service (Unit)', () => {
  let taskService: TaskService;
  let engageQueue: Queue;
  let graceQueue: Queue;
  let idleQueue: Queue;
  let jackpotReloginQueue: Queue;
  let balanceQueueQueue: Queue;
  let pingRobotQueue: Queue;

  let addJobSpy: { [key: string]: any };
  let getJobSpy: { [key: string]: any };
  let removeSpy: any;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    taskService = moduleFixture.get<TaskService>(TaskService);
    engageQueue = moduleFixture.get<Queue>(getQueueToken(Timeout.ENGAGE));
    graceQueue = moduleFixture.get<Queue>(getQueueToken(Timeout.GRACE));
    idleQueue = moduleFixture.get<Queue>(getQueueToken(Timeout.IDLE));
    jackpotReloginQueue = moduleFixture.get<Queue>(getQueueToken(Timeout.JACKPOT_RELOGIN));
    balanceQueueQueue = moduleFixture.get<Queue>(getQueueToken(Cron.BALANCE_QUEUE));
    pingRobotQueue = moduleFixture.get<Queue>(getQueueToken(Cron.PING_ROBOT));
    addJobSpy = {
      [Timeout.ENGAGE]: jest.spyOn(engageQueue, 'add'),
      [Timeout.GRACE]: jest.spyOn(graceQueue, 'add'),
      [Timeout.IDLE]: jest.spyOn(idleQueue, 'add'),
      [Timeout.JACKPOT_RELOGIN]: jest.spyOn(jackpotReloginQueue, 'add'),
      [Cron.BALANCE_QUEUE]: jest.spyOn(balanceQueueQueue, 'add'),
      [Cron.PING_ROBOT]: jest.spyOn(pingRobotQueue, 'add'),
    };
    getJobSpy = {
      [Timeout.ENGAGE]: jest.spyOn(engageQueue, 'getJob'),
      [Timeout.GRACE]: jest.spyOn(graceQueue, 'getJob'),
      [Timeout.IDLE]: jest.spyOn(idleQueue, 'getJob'),
      [Timeout.JACKPOT_RELOGIN]: jest.spyOn(jackpotReloginQueue, 'getJob'),
      [Cron.BALANCE_QUEUE]: jest.spyOn(balanceQueueQueue, 'getJob'),
      [Cron.PING_ROBOT]: jest.spyOn(pingRobotQueue, 'getJob'),
    };
    removeSpy = jest.spyOn(jobMock, 'remove');
  });

  describe('startIdleTimeoutTask', () => {
    it('should add idle timeout task to queue', async () => {
      await taskService.startIdleTimeoutTask(1, 10);
      expect(addJobSpy[Timeout.IDLE]).toBeCalledWith(Timeout.IDLE, { sessionId: 1 }, expect.objectContaining({ delay: 10000 }));
    });
  });

  describe('stopIdleTimeoutTask', () => {
    it('should remove idle timeout task from queue', async () => {
      getJobSpy[Timeout.IDLE].mockResolvedValueOnce(jobMock);
      await taskService.stopIdleTimeoutTask(1);
      expect(getJobSpy[Timeout.IDLE]).toBeCalledWith(`${Timeout.IDLE}1`);
      expect(removeSpy).toBeCalled();
    });
  });

  describe('startGraceTimeoutTask', () => {
    it('should add grace timeout task to queue', async () => {
      await taskService.startGraceTimeoutTask(1, 10);
      expect(addJobSpy[Timeout.GRACE]).toBeCalledWith(Timeout.GRACE, { sessionId: 1 }, expect.objectContaining({ delay: 10000 }));
    });
  });

  describe('stopGraceTimeoutTask', () => {
    it('should remove grace timeout task from queue', async () => {
      getJobSpy[Timeout.GRACE].mockResolvedValueOnce(jobMock);
      await taskService.stopGraceTimeoutTask(1);
      expect(getJobSpy[Timeout.GRACE]).toBeCalledWith(`${Timeout.GRACE}1`);
      expect(removeSpy).toBeCalled();
    });
  });

  describe('startEngageTimeoutTask', () => {
    it('should add engage timeout task to queue', async () => {
      await taskService.startEngageTimeoutTask(1, 10);
      expect(addJobSpy[Timeout.ENGAGE]).toBeCalledWith(Timeout.ENGAGE, { sessionId: 1 }, expect.objectContaining({ delay: 10000 }));
    });
  });

  describe('stopEngageTimeoutTask', () => {
    it('should remove engage timeout task from queue', async () => {
      getJobSpy[Timeout.ENGAGE].mockResolvedValueOnce(jobMock);
      await taskService.stopEngageTimeoutTask(1);
      expect(getJobSpy[Timeout.ENGAGE]).toBeCalledWith(`${Timeout.ENGAGE}1`);
      expect(removeSpy).toBeCalled();
    });
  });

  describe('startJackpotReloginTimeoutTask', () => {
    it('should add jackpot relogin timeout task to queue', async () => {
      await taskService.startJackpotReloginTimeoutTask(10);
      expect(addJobSpy[Timeout.JACKPOT_RELOGIN]).toBeCalledWith(Timeout.JACKPOT_RELOGIN, {}, expect.objectContaining({ repeat: { every: 10000 } }));
    });
  });
});

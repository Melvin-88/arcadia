import {
  connectionNames, getRepositoryToken, SessionRepository, SessionStatus, TiltMode,
} from 'arcadia-dal';
import { RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { makeTestModule } from './mocks/beforeAll.app.service.mock';
import { TaskService } from './modules/task/task.service';
import { RoundEndDelayDto } from './modules/dto/round.end.delay.dto';

jest.mock('./modules/logger/logger.service');

describe('App Service (Unit)', () => {
  let appService: AppService;
  let sessionRepository: SessionRepository;
  let taskService: TaskService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    appService = moduleFixture.get<AppService>(AppService);
    sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
    taskService = moduleFixture.get<TaskService>(TaskService);
  });

  describe('handlePlayerIdle', () => {
    it('should throw exception if session wasn\'t found', async () => {
      try {
        await appService.playerIdleStart(1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(RpcException);
      }
    });
    it('should stop old idle timer and start new', async () => {
      const stopIdleSpy = jest.spyOn(taskService, 'stopIdleTimeoutTask');
      const startIdleSpy = jest.spyOn(taskService, 'startIdleTimeoutTask');
      jest.spyOn(sessionRepository as any, 'findOne').mockResolvedValueOnce({ group: { idleTimeout: 20, graceTimeout: 5 } });
      await appService.playerIdleStart(1);
      expect(stopIdleSpy).toBeCalledWith(1);
      expect(startIdleSpy).toBeCalledWith(1, 25);
    });
  });

  describe('handlePlayerIdleStop', () => {
    it('should stop idle timer', async () => {
      const stopIdleSpy = jest.spyOn(taskService, 'stopIdleTimeoutTask');
      await appService.handlePlayerIdleStop(1);
      expect(stopIdleSpy).toBeCalledWith(1);
    });
  });

  describe('handlePlayerGrace', () => {
    it('should throw exception if session wasn\'t found', async () => {
      try {
        await appService.playerGraceStart(1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(RpcException);
      }
    });
    it('should stop old grace timer and start new', async () => {
      const stopGraceSpy = jest.spyOn(taskService, 'stopGraceTimeoutTask');
      const startGraceSpy = jest.spyOn(taskService, 'startGraceTimeoutTask');
      jest.spyOn(sessionRepository as any, 'findOne').mockResolvedValueOnce({ group: { graceTimeout: 20, idleTimeout: 10 } });
      await appService.playerGraceStart(1);
      expect(stopGraceSpy).toBeCalledWith(1);
      expect(startGraceSpy).toBeCalledWith(1, 30);
    });
  });

  describe('handlePlayerGraceStop', () => {
    it('should stop grace timer', async () => {
      const stopGraceSpy = jest.spyOn(taskService, 'stopGraceTimeoutTask');
      await appService.handlePlayerGraceStop(1);
      expect(stopGraceSpy).toBeCalledWith(1);
    });
  });

  describe('handleStartEngage', () => {
    it('should throw exception if session wasn\'t found', async () => {
      try {
        await appService.handleStartEngage(1);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(RpcException);
      }
    });
    it('should stop old engage timer and start new', async () => {
      const stopEngageSpy = jest.spyOn(taskService, 'stopEngageTimeoutTask');
      const startEngageSpy = jest.spyOn(taskService, 'startEngageTimeoutTask');
      jest.spyOn(sessionRepository as any, 'findOne').mockResolvedValueOnce({ group: { engageTimeout: 20 } });
      await appService.handleStartEngage(1);
      expect(stopEngageSpy).toBeCalledWith(1);
      expect(startEngageSpy).toBeCalledWith(1, 20);
    });
  });

  describe('handleStopEngage', () => {
    it('should stop engage timer', async () => {
      const stopEngageSpy = jest.spyOn(taskService, 'stopEngageTimeoutTask');
      await appService.handlePlayerGraceStop(1);
      expect(stopEngageSpy).toBeCalledWith(1);
    });
  });

  describe('handleStartJackpotRelogin', () => {
    it('should start jackpot relogin timer', async () => {
      const startReloginSpy = jest.spyOn(taskService, 'startJackpotReloginTimeoutTask');
      await appService.handleStartJackpotRelogin();
      expect(startReloginSpy).toBeCalledWith(20);
    });
  });

  describe('handleStopJackpotRelogin', () => {
    it('should stop jackpot relogin timer', async () => {
      const stopReloginSpy = jest.spyOn(taskService, 'stopJackpotReloginTimeoutTask');
      await appService.handleStopJackpotRelogin();
      expect(stopReloginSpy).toBeCalled();
    });
  });

  describe('roundEndDelayStart', () => {
    it('should stop old and start new round end delay timer', async () => {
      const roundEndData: RoundEndDelayDto = {
        timeout: 20,
        sessionId: 5,
      };
      const roundEndDelayStartSpy = jest.spyOn(taskService, 'startRoundEndDelayTimeoutTask');
      const roundEndDelayStopSpy = jest.spyOn(taskService, 'stopRoundEndDelayTask');
      await appService.roundEndDelayStart(roundEndData);
      expect(roundEndDelayStartSpy).toBeCalledWith(roundEndData);
      expect(roundEndDelayStopSpy).toBeCalledWith(roundEndData.sessionId);
    });
  });
});

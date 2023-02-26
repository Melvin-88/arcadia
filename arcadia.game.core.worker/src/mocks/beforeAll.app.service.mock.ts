import { Test } from '@nestjs/testing';
import { connectionNames, getRepositoryToken, SessionRepository } from 'arcadia-dal';
import { TaskService } from '../modules/task/task.service';
import { AppLogger } from '../modules/logger/logger.service';
import { ConfigService } from '../modules/config/config.service';
import { repoMockFactory } from '../util/repoMockFactory';
import { AppService } from '../app.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      AppService,
      AppLogger,
      {
        useValue: { get: () => 20 },
        provide: ConfigService,
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: {
          startIdleTimeoutTask: () => null,
          stopIdleTimeoutTask: () => null,
          startGraceTimeoutTask: () => null,
          stopGraceTimeoutTask: () => null,
          startEngageTimeoutTask: () => null,
          stopEngageTimeoutTask: () => null,
          startJackpotReloginTimeoutTask: () => null,
          stopJackpotReloginTimeoutTask: () => null,
          startRoundEndDelayTimeoutTask: () => null,
          stopRoundEndDelayTask: () => null,
        },
        provide: TaskService,
      },
    ],
  }).compile();

  return moduleFixture;
}
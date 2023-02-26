import { Test } from '@nestjs/testing';
import {
  connectionNames,
  CurrencyConversionRepository,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  PlayerRepository,
  QueueRepository,
  SessionRepository,
} from 'arcadia-dal';
import { HttpModule } from '@nestjs/common';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { ConfigService } from '../../config/config.service';
import { AppLogger } from '../../logger/logger.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { SessionService } from '../../session/session.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { JackpotApiClientService } from '../jackpot.api.client.service';
import { REDIS_CACHE } from '../../global.cache/redis.cache.module';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      JackpotApiClientService,
      {
        useValue: {
          ...repoMockFactory(), getByGroupAndIds: () => {
          }
        },
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: {
          ...repoMockFactory(), getCurrencyConversion: () => {
          }
        },
        provide: getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA),
      },
      {
        useValue: {
          create: () => {
          }, getAutoplayConfig: () => {
          }
        },
        provide: SessionService,
      },
      {
        useValue: {
          getBalance: () => null,
          cancelWager: () => null,
          bet: () => null,
          payout: () => null,
        },
        provide: OperatorApiClientService,
      },
      {
        useValue: {
          stopIdleTimeout: () => {
          }, stopJackpotReloginTimeout: () => Promise.resolve(), stopGraceTimeout: () => {
          }
        },
        provide: WorkerClientService,
      },
      {
        useValue: {
          forceChangeMachine: () => {
          }
        },
        provide: QueueManagerService,
      },
      {
        useValue: {
          create: () => {
          }, sendStopMessage: () => {
          }
        },
        provide: RobotClientService,
      },
      {
        useValue: {
          createQueryBuilder: () => {
          }
        },
        provide: SessionRepository,
      },
      {
        useValue: {
          get: () => null,
          set: () => null,
          del: () => null,
        },
        provide: REDIS_CACHE,
      },
      {
        useValue: {
          notifyJackpot: () => null,
          notifyBalance: () => null,
        },
        provide: PlayerClientService,
      },
      {
        useValue: { sendEventLogMessage: () => null, sendAlertMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: {
          getSessionToken: () => null,
          getJackpotTransactionId: () => null,
          setJackpotTransactionId: () => {},
          getRoundTransactionId: () => null,
          },
        provide: SessionDataManager,
      },
      {
        useValue: {
          get: (args: any) => {
            switch (args[1]) {
              case 'BLUE_RIBBON_API_URL':
                return '<url>';
              case 'BLUE_RIBBON_AUTHENTICATION_KEY':
                return '<authKey>';
              case 'BLUE_RIBBON_AUTHENTICATION_SECRET':
                return '<authSecret>';
              default:
                return '<config>';
            }
          },
        },
        provide: ConfigService,
      },
      AppLogger,
    ],
  }).compile();
  return moduleFixture;
}

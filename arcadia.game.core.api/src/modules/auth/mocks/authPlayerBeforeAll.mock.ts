import { Test } from '@nestjs/testing';
import {
  connectionNames, CurrencyConversionRepository,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  OperatorRepository,
  PlayerRepository, RngChipPrizeRepository, SessionRepository,
} from 'arcadia-dal';
import { AuthService } from '../auth.service';
import { SessionService } from '../../session/session.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { VideoApiClientService } from '../../video.api.client/video.api.client.service';
import { ConfigService } from '../../config/config.service';
import { AppLogger } from '../../logger/logger.service';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { IpChecker } from '../../ip.checker/ip.checker';
import { REDIS_CACHE } from '../../global.cache/redis.cache.module';
import { ConfigValidator } from '../../config.validator/configValidator';

export async function makeTestModule() {
  const sessionRepo = {
    ...repoMockFactory(),
    findOne: () => ({
      player: { cid: '<cid>', lastSessionDate: new Date() },
      totalBets: 322,
      totalWinning: 322,
    }),
  };
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      AuthService,
      {
        useValue: { ...repoMockFactory(), getMachineForNewSession: () => null },
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
        provide: getRepositoryToken(OperatorRepository, connectionNames.DATA),
      },
      {
        useValue: sessionRepo,
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getCurrencyConversion: () => {} },
        provide: getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getAllPrizes: () => {} },
        provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      },
      {
        useValue: { create: () => {}, getAutoplayConfig: () => {} },
        provide: SessionService,
      },
      {
        useValue: {
          getBalance: () => null,
          auth: () => null,
        },
        provide: OperatorApiClientService,
      },
      {
        useValue: { create: () => {} },
        provide: PlayerClientService,
      },
      {
        useValue: { create: () => {}, sendStopMessage: () => {} },
        provide: RobotClientService,
      },
      {
        useValue: { create: () => {}, sendEventLogMessage: () => {} },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: { getCameraStreamsFormatted: () => {}, getCameraStreams: () => {} },
        provide: VideoApiClientService,
      },
      {
        useValue: {
          get: (args: any) => {
            switch (args[1]) {
              case 'GC_CURRENCY_WHITELIST':
                return 'EUR,USD';
              case 'STREAM_AUTH_SECRET':
              case 'ROBOTS_AUTH_SECRET':
                return 'muchsecret';
              default:
                return '<config>';
            }
          },
        },
        provide: ConfigService,
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
          setToken: () => null,
          setSessionToken: () => null,
        },
        provide: SessionDataManager,
      },
      {
        useValue: {
          verifyIp: () => true,
        },
        provide: IpChecker,
      },
      {
        useValue: {
          getValidatedConfig: () => null,
        },
        provide: ConfigValidator,
      },
      AppLogger,
    ],
  }).compile();
  return moduleFixture;
}

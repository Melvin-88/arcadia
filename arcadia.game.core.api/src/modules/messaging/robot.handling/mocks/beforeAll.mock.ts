import { Test } from '@nestjs/testing';
import { CACHE_MANAGER, HttpModule } from '@nestjs/common';
import {
  ChipRepository, ChipTypeRepository,
  connectionNames, CurrencyConversionRepository,
  getRepositoryToken,
  GroupRepository, MachineDispenserRepository,
  MachineRepository, PlayerRepository, QueueRepository, RngChipPrizeRepository, RoundArchiveRepository,
  RoundRepository, SeedHistoryRepository,
  SessionRepository,
} from 'arcadia-dal';
import { repoMockFactory } from '../../../../util/repoMockFactory';
import { SessionService } from '../../../session/session.service';
import { OperatorApiClientService } from '../../../operator.api.client/operator.api.client.service';
import { WorkerClientService } from '../../../worker.client/worker.client.service';
import { QueueManagerService } from '../../../queue.manager/queue.manager.service';
import { PlayerClientService } from '../../../player.client/player.client.service';
import { MonitoringWorkerClientService } from '../../../monitoring.worker.client/monitoring.worker.client.service';
import { RobotClientService } from '../../../robot.client/robot.client.service';
import { AppLogger } from '../../../logger/logger.service';
import { ConfigService } from '../../../config/config.service';
import { RobotMessageService } from '../robot.message.service';
import { RngClientService } from '../../../rng.service.client/rng.client.service';
import { RoundService } from '../../../round/round.service';
import { EventBusPublisher } from '../../../event.bus/event.bus.publisher';
import { BalanceNotifier } from '../../../balance.notifier/balance.notifier';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      RobotMessageService,
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getFreeQueue: () => null },
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(ChipTypeRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(RoundArchiveRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SeedHistoryRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getChipPrize: () => null },
        provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      },
      {
        useValue: { decrement: () => null, ...repoMockFactory() },
        provide: getRepositoryToken(MachineDispenserRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getBetList: () => null },
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), manager: { transaction: () => {} } },
        provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      },
      {
        useValue: { create: () => {}, saveAndArchive: () => {}, terminateSessions: () => {} },
        provide: SessionService,
      },
      {
        useValue: {
          getBalance: () => null,
          cancelWager: () => null,
          wager: () => ({ toPromise: () => null }),
        },
        provide: OperatorApiClientService,
      },
      {
        useValue: {
          startIdleTimeout: () => {},
          stopIdleTimeout: () => {},
          stopJackpotReloginTimeout: () => Promise.resolve(),
          stopGraceTimeout: () => {},
          startEngageTimeout: () => null,
          stopEngageTimeout: () => null,
        },
        provide: WorkerClientService,
      },
      {
        useValue: {
          notifyQueueUpdate: () => null,
          getNextSession: () => null,
          sendNewQueueData: () => null,
          assignSessionToQueue: () => null,
          forceChangeMachine: () => null,
        },
        provide: QueueManagerService,
      },
      {
        useValue: {
          ...repoMockFactory(), countNewRound: () => null, createQueryBuilder: () => null, getBetBehindersFromQueue: () => Promise.resolve([]),
        },
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: {
          get: () => null,
          set: () => null,
          del: () => null,
        },
        provide: CACHE_MANAGER,
      },
      {
        useValue: {
          sendNotification: () => null, notifySessionResult: () => null, notifyBuyResult: () => null, notifyQueueChangeOffer: () => null, notifyForcedAutoplay: () => null,
        },
        provide: PlayerClientService,
      },
      {
        useValue: { sendEventLogMessage: () => null, sendOutOfSessionEventLogMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: {
          sendAutoplayMessage: () => null,
          sendStopAutoplayMessage: () => null,
          sendDisengageMessage: () => null,
          sendAllowCoinsMessage: () => null,
          sendTableMessage: () => null,
          sendStopMessage: () => null,
          sendChipValidationMessage: () => null,
          sendEngageMessage: () => null,
          sendPushMessage: () => null,
        },
        provide: RobotClientService,
      },
      {
        useValue: {
          seed: () => Promise.resolve([]),
          phantom: () => null,
        },
        provide: RngClientService,
      },
      {
        useValue: {
          createRound: () => null,
        },
        provide: RoundService,
      },
      AppLogger,
      {
        useValue: {
          get: (params: string[]) => {
            switch (params[1]) {
              case 'ROBOTS_AUTH_SECRET':
                return '<secret>';
              case 'EXTERNAL_RABBITMQ_HOST':
                return '<host>';
              case 'RABBITMQ_PORT':
                return '<port>';
              case 'RABBITMQ_USERNAME':
                return '<user>';
              case 'RABBITMQ_PASSWORD':
                return '<password>';
              case 'EXTERNAL_REDIS_HOST':
                return '<redisHost>';
              case 'REDIS_PORT':
                return '<port>';
              default:
                return null;
            }
          },
        },
        provide: ConfigService,
      },
      {
        useValue: { sendJackpotState: () => null },
        provide: EventBusPublisher,
      },
      {
        useValue: { notifyBalance: () => null },
        provide: BalanceNotifier,
      },
    ],
  }).compile();
  return moduleFixture;
}

import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  GroupRepository, MachineRepository,
  QueueRepository, RngChipPrizeRepository, RoundRepository, SessionRepository, VoucherRepository,
} from 'arcadia-dal';
import { repoMockFactory } from '../../../../util/repoMockFactory';
import { SessionService } from '../../../session/session.service';
import { OperatorApiClientService } from '../../../operator.api.client/operator.api.client.service';
import { WorkerClientService } from '../../../worker.client/worker.client.service';
import { QueueManagerService } from '../../../queue.manager/queue.manager.service';
import { RobotClientService } from '../../../robot.client/robot.client.service';
import { AppLogger } from '../../../logger/logger.service';
import { ConfigService } from '../../../config/config.service';
import { PlayerMessageService } from '../player.message.service';
import { PlayerClientService } from '../../../player.client/player.client.service';
import { MonitoringWorkerClientService } from '../../../monitoring.worker.client/monitoring.worker.client.service';
import { VideoApiClientService } from '../../../video.api.client/video.api.client.service';
import { JackpotApiClientService } from '../../../jackpot.api.client/jackpot.api.client.service';
import { BalanceNotifier } from '../../../balance.notifier/balance.notifier';
import { REDIS_CACHE } from '../../../global.cache/redis.cache.module';
import { SessionDataManager } from '../../../session.data.manager/sessionDataManager';
import { EventBusPublisher } from '../../../event.bus/event.bus.publisher';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      PlayerMessageService,
      {
        useValue: { ...repoMockFactory(), getBetList: () => null },
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), manager: { transaction: () => {} } },
        provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      },
      {
        useValue: {
          create: () => {}, saveAndArchive: () => {}, finalizeSessions: () => null, terminateSessions: () => {},
        },
        provide: SessionService,
      },
      {
        useValue: {
          getBalance: () => null,
          cancelWager: () => null,
          balance: () => null,
        },
        provide: OperatorApiClientService,
      },
      {
        useValue: {
          startIdleTimeout: () => {},
          stopIdleTimeout: () => {},
          stopJackpotReloginTimeout: () => Promise.resolve(),
          stopGraceTimeout: () => {},
        },
        provide: WorkerClientService,
      },
      {
        useValue: { notifyQueueUpdate: () => null, sendNewQueueData: () => null, assignSessionToQueue: () => null },
        provide: QueueManagerService,
      },
      {
        useValue: { ...repoMockFactory(), createQueryBuilder: () => {} },
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), createQueryBuilder: () => {}, getLobbyAndChangeBetGroupData: () => null },
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getVoucherForSession: () => null },
        provide: getRepositoryToken(VoucherRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getPayTable: () => null },
        provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
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
          sendNotification: () => null,
          forceReconnect: () => null,
          sendBets: () => null,
          notifyBuyResult: () => null,
          notifyQueueChangeOffer: () => null,
          notifyAutoplay: () => null,
          queueBalance: () => null,
          sendError: () => null,
        },
        provide: PlayerClientService,
      },
      {
        useValue: { sendEventLogMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: { removeSessionData: () => null, getSessionToken: () => null, updateSessionData: () => null },
        provide: SessionDataManager,
      },
      {
        useValue: {
          sendAutoplayMessage: () => null,
          sendStopAutoplayMessage: () => null,
          sendDisengageMessage: () => null,
          sendAllowCoinsMessage: () => null,
        },
        provide: RobotClientService,
      },
      {
        useValue: {},
        provide: VideoApiClientService,
      },
      {
        useValue: {
          checkJackpotAvailable: () => {},
          placeBet: () => {},
          calculateContributionAmount: () => {},
          getContribution: () => {},
        },
        provide: JackpotApiClientService,
      },
      {
        useValue: {},
        provide: BalanceNotifier,
      },
      {
        useValue: { engageNextSession: () => null },
        provide: EventBusPublisher,
      },
      AppLogger,
      ConfigService,
    ],
  }).compile();
  return moduleFixture;
}

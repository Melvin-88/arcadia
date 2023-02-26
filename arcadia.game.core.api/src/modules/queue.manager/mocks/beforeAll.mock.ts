import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  QueueRepository,
  SessionRepository,
} from 'arcadia-dal';
import { QueueManagerService } from '../queue.manager.service';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { SessionService } from '../../session/session.service';
import { VideoApiClientService } from '../../video.api.client/video.api.client.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      QueueManagerService,
      {
        useValue: { ...repoMockFactory(), getFreeQueue: () => null },
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: {
          ...repoMockFactory(), countNewRound: () => null, createQueryBuilder: () => null, getNextSessionForQueue: () => null,
        },
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getBetList: () => null },
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: { sendEventLogMessage: () => null, sendOutOfSessionEventLogMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: {
          sendNotification: () => null,
          notifySessionResult: () => null,
          notifyBuyResult: () => null,
          notifyQueueChangeOffer: () => null,
          notifyForcedAutoplay: () => null,
          notifyQueueChangeData: () => null,
          notifyQueueUpdate: () => null,
        },
        provide: PlayerClientService,
      },
      {
        useValue: { create: () => {}, saveAndArchive: () => {}, terminateSessions: () => {} },
        provide: SessionService,
      },
      {
        useValue: {
          getCameraStreamsFormatted: () => null,
        },
        provide: VideoApiClientService,
      },
    ],
  }).compile();
  return moduleFixture;
}

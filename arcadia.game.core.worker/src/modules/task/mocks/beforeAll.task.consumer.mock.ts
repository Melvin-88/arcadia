import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  QueueRepository,
  SessionRepository, VoucherRepository,
} from 'arcadia-dal';
import { getQueueToken } from '@nestjs/bull';
import { ServerRMQ } from '../../../rabbitMQ.strategy';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { ConfigService } from '../../config/config.service';
import { CoreClientService } from '../../coreClient/coreClient.service';
import { AppLogger } from '../../logger/logger.service';
import { TaskConsumer } from '../task.consumer';
import { Cron, Timeout } from '../../enum';

export const taskConsumerRmqServerMock = {
  sendMessage: () => null,
  setupChannel: () => null,
};

export const taskConsumerRedisServerMock = {};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      TaskConsumer,
      AppLogger,
      {
        useValue: { ...repoMockFactory(), getActiveGroupsWithActiveQueues: () => null },
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getMachinesToPing: () => null },
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), findByIds: () => null, getQueueLengthData: () => null },
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(VoucherRepository, connectionNames.DATA),
      },
      {
        useValue: {
          sendMessage: () => null,
          sendIdleTimeoutMessage: () => null,
          sendGraceTimeoutMessage: () => null,
          sendEngageTimeoutMessage: () => null,
          sendQueueChangeOfferMessage: () => null,
          sendJackpotReloginTimeoutMessage: () => null,
          sendRoundEndDelayMessage: () => null,
        },
        provide: CoreClientService,
      },
      {
        useValue: { get: () => 2 },
        provide: ConfigService,
      },
      {
        useValue: taskConsumerRmqServerMock,
        provide: ServerRMQ,
      },
      ...[...Object.values(Timeout), ...Object.values(Cron)].map(name => ({
        useValue: { add: () => null, getJob: () => null, process: () => null },
        provide: getQueueToken(name),
      })),
      {
        useValue: new Map<Cron, { jobName: string; timeout: number }>(),
        provide: 'CRON_DATA',
      },
    ],
  }).compile();

  jest.spyOn(ServerRMQ as any, 'getInstance').mockReturnValue(taskConsumerRmqServerMock);
  return moduleFixture;
}

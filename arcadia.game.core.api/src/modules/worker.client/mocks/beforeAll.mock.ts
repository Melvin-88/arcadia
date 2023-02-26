import { Test } from '@nestjs/testing';
import { AppLogger } from '../../logger/logger.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';
import { WorkerClientService } from '../worker.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { ConfigService } from '../../config/config.service';

export const workerRmqServerMock = {
  sendMessage: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      WorkerClientService,
      {
        useValue: { get: () => null },
        provide: ConfigService,
      },
      AppLogger,
      {
        useValue: workerRmqServerMock,
        provide: ServerRMQ,
      },
      {
        useValue: { notifyIdleTimoutReset: () => null },
        provide: PlayerClientService,
      },
    ],
  }).compile();
  // @ts-ignore
  jest.spyOn(ServerRMQ, 'getInstance').mockReturnValue(workerRmqServerMock);
  return moduleFixture;
}

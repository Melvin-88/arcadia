import { Test } from '@nestjs/testing';
import { AppLogger } from '../../logger/logger.service';
import { MonitoringWorkerClientService } from '../monitoring.worker.client.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';

export const rmqServerMock = {
  sendMessage: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      MonitoringWorkerClientService,
      AppLogger,
      {
        useValue: rmqServerMock,
        provide: ServerRMQ,
      },
    ],
  }).compile();
  // @ts-ignore
  jest.spyOn(ServerRMQ, 'getInstance').mockReturnValue(rmqServerMock);
  return moduleFixture;
}

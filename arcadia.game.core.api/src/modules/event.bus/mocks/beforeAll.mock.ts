import { Test } from '@nestjs/testing';
import { AppLogger } from '../../logger/logger.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';
import { EventBusPublisher } from '../event.bus.publisher';

export const eventBusRmqServerMock = {
  sendMessage: () => null,
  setupChannel: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      EventBusPublisher,
      AppLogger,
      {
        useValue: eventBusRmqServerMock,
        provide: ServerRMQ,
      },
    ],
  }).compile();
  // @ts-ignore
  jest.spyOn(ServerRMQ, 'getInstance').mockReturnValue(eventBusRmqServerMock);
  return moduleFixture;
}

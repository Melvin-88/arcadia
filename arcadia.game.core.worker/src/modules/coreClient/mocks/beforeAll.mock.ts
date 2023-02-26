import { Test } from '@nestjs/testing';
import { CoreClientService } from '../coreClient.service';
import { AppLogger } from '../../logger/logger.service';
import { ServerRMQ } from '../../../rabbitMQ.strategy';

export const coreClientRmqServerMock = {
  sendMessage: () => null,
  setupChannel: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      CoreClientService,
      AppLogger,
      {
        useValue: coreClientRmqServerMock,
        provide: ServerRMQ,
      },
    ],
  }).compile();
  jest.spyOn(ServerRMQ as any, 'getInstance').mockReturnValue(coreClientRmqServerMock);
  return moduleFixture;
}

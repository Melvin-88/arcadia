import { Test } from '@nestjs/testing';
import { RobotClientService } from '../robot.client.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';

export const robotRmqServerMock = {
  sendMessage: () => null,
  setupChannel: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      RobotClientService,
      {
        useValue: robotRmqServerMock,
        provide: ServerRMQ,
      },
    ],
  }).compile();
  // @ts-ignore
  jest.spyOn(ServerRMQ, 'getInstance').mockReturnValue(robotRmqServerMock);
  return moduleFixture;
}

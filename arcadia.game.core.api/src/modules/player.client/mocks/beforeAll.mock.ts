import { Test } from '@nestjs/testing';
import { PlayerClientService } from '../player.client.service';
import { REDIS_PUBLISHER_CLIENT } from '../../../constants/redis.constants';

export const emitterMock = {
  emit: () => null,
  to: () => emitterMock,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      PlayerClientService,
      {
        useValue: emitterMock,
        provide: REDIS_PUBLISHER_CLIENT,
      },
    ],
  }).compile();
  return moduleFixture;
}

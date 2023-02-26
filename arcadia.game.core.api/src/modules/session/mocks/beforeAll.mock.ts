import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  RoundArchiveRepository,
  RoundRepository,
  SessionArchiveRepository,
  SessionRepository,
} from 'arcadia-dal';
import { CACHE_MANAGER } from '@nestjs/common';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { SessionService } from '../session.service';
import { PlayerClientService } from '../../player.client/player.client.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      SessionService,
      {
        useValue: { ...repoMockFactory(), findByIds: () => null, manager: { transaction: () => null } },
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionArchiveRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(RoundArchiveRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      },
      {
        useValue: { notifyReturnToLobby: () => null },
        provide: PlayerClientService,
      },
      {
        useValue: { get: () => null, set: () => null, del: () => null },
        provide: CACHE_MANAGER,
      },
    ],
  }).compile();
  return moduleFixture;
}

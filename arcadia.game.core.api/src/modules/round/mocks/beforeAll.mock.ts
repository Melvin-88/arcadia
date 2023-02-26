import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  RoundArchiveRepository,
  RoundRepository,
  SeedHistoryRepository,
} from 'arcadia-dal';
import { RoundService } from '../round.service';
import { RngHelper } from '../../rng.service.client/rng.helper';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { RngClientService } from '../../rng.service.client/rng.client.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      RoundService,
      RngHelper,
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(RoundArchiveRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SeedHistoryRepository, connectionNames.DATA),
      },
      {
        useValue: {},
        provide: RngClientService,
      },
    ],
  }).compile();
  return moduleFixture;
}

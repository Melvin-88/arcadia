import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  RoundArchiveRepository,
  RoundRepository,
  SeedHistoryRepository,
} from 'arcadia-dal';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { RngClientService } from '../rng.client.service';
import { RngHelper } from '../rng.helper';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
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
        useValue: { ...repoMockFactory(), getSeedHistory: () => null },
        provide: getRepositoryToken(SeedHistoryRepository, connectionNames.DATA),
      },
      {
        useValue: { rtp: () => null },
        provide: RngClientService,
      },
    ],
  }).compile();
  return moduleFixture;
}

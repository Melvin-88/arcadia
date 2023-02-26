import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  connectionNames,
  getRepositoryToken,
  SessionArchiveRepository,
  SessionRepository,
} from 'arcadia-dal';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { ConfigService } from '../../config/config.service';
import { VideoApiClientService } from '../video.api.client.service';

export async function makeTestModule() {
  return await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      VideoApiClientService,
      {
        useValue: { ...repoMockFactory(), findByIds: () => null },
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionArchiveRepository, connectionNames.DATA),
      },
      {
        useValue: { get: () => null },
        provide: ConfigService,
      },
    ],
  }).compile();
}

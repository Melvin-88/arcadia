import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { OperatorApiClientService } from '../operator.api.client.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      OperatorApiClientService,
    ],
  }).compile();
  return moduleFixture;
}

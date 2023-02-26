import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLogger } from '../../logger/logger.service';
import { RngClientService } from '../rng.client.service';

export async function makeTestModule() {
  return await Test.createTestingModule({
    imports: [HttpModule],
    providers: [
      RngClientService,
      AppLogger,
    ],
  }).compile();
}

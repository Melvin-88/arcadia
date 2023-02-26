import { Test } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { AppLogger } from '../../logger/logger.service';
import { ConfigService } from '../../config/config.service';
import { TaskService } from '../task.service';
import { Cron, Timeout } from '../../enum';

export const jobMock = {
  remove: () => null,
};

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      TaskService,
      AppLogger,
      {
        useValue: { get: () => 2 },
        provide: ConfigService,
      },
      ...[...Object.values(Timeout), ...Object.values(Cron)].map(name => ({
        useValue: { add: () => null, getJob: () => null },
        provide: getQueueToken(name),
      })),
      {
        useValue: new Map<Cron, { jobName: string; timeout: number }>(),
        provide: 'CRON_DATA',
      },
    ],
  }).compile();

  return moduleFixture;
}

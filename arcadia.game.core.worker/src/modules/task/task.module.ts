import { BullModule } from '@nestjs/bull';
import { Module, Provider } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  MachineRepository,
  QueueRepository,
  SessionRepository,
  VoucherRepository,
} from 'arcadia-dal';
import { ConfigService } from '../config/config.service';
import { CoreClientModule } from '../coreClient/coreClient.module';
import { Cron, Timeout } from '../enum';
import { LoggerModule } from '../logger/logger.module';
import { TaskConsumer } from './task.consumer';
import { TaskService } from './task.service';

const cronJobsDataProvider: Provider = {
  provide: 'CRON_DATA',
  useFactory: async (
    configService: ConfigService,
  ): Promise<Map<Cron, { jobName: string; timeout: number }>> => Object.values(Cron)
    .reduce((acc, type) => {
      let timeout: any;
      switch (type) {
        case Cron.BALANCE_QUEUE:
          timeout = configService.get(['core', 'QUEUE_BALANCE_TIMEOUT_SEC']);
          break;
        case Cron.PING_ROBOT:
          timeout = configService.get(['core', 'ROBOTS_PING_TIMEOUT_SEC']);
          break;
        case Cron.TERMINATE_VIEWERS:
          timeout = configService.get(['core', 'TERMINATE_VIEWERS_INTERVAL_SEC']);
          break;
        case Cron.EXPIRE_VOUCHERS:
          timeout = configService.get(['core', 'EXPIRE_VOUCHERS_INTERVAL_SEC']);
          break;
        default:
      }
      timeout = Math.round(Number(timeout) * 1000);
      acc.set(type, {
        jobName: `${type}-${timeout}`,
        timeout,
      });
      return acc;
    }, new Map<Cron, { jobName: string; timeout: number }>()),
  inject: [ConfigService],
};

@Module({
  providers: [cronJobsDataProvider,
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(QueueRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(VoucherRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(VoucherRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    TaskService,
    TaskConsumer,
  ],
  imports: [
    ...[...Object.values(Timeout), ...Object.values(Cron)].map(name => BullModule.registerQueueAsync({
      name,
      useFactory: (configService: ConfigService) => ({
        redis: configService.getRedisConfig(),
      }),
      inject: [ConfigService],
    }),
    ),
    LoggerModule,
    CoreClientModule,
  ],
  exports: [TaskService],
})
export class TaskModule {
}

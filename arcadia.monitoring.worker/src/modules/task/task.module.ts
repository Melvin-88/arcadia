import { Module } from '@nestjs/common';
import {
  getRepositoryToken,
  connectionNames,
  getConnectionToken,
  SessionRepository,
  PerformanceTrackerRepository,
  PerformanceIndicatorRepository,
  RoundRepository,
  AlertRepository, SessionArchiveRepository, RoundArchiveRepository, ChipRepository, QueueRepository, MachineRepository,
} from 'arcadia-dal';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';
import { TaskService } from './task.service';
import { TaskConsumer } from './task.consumer';
import { LoggerModule } from '../logger/logger.module';
import { CoreClientModule } from '../coreClient/coreClient.module';
import { BullQueues } from '../enum/bull.queues';
import {
  EventLog, EventLogSchema, RobotEventLog, RobotEventLogSchema,
} from '../schemas';

@Module({
  providers: [
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SessionArchiveRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionArchiveRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PerformanceTrackerRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PerformanceTrackerRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PerformanceIndicatorRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PerformanceIndicatorRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RoundArchiveRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundArchiveRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(AlertRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(AlertRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(QueueRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    TaskService,
    TaskConsumer,
  ],
  imports: [
    BullModule.registerQueueAsync({
      name: BullQueues.KPI_TASK,
      useFactory: (configService: ConfigService) => ({
        redis: configService.getRedisConfig(),
        limiter: {
          max: 100,
          duration: 5000,
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    CoreClientModule,
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
      { name: RobotEventLog.name, schema: RobotEventLogSchema },
    ]),
  ],
  exports: [TaskService],
})
export class TaskModule {}

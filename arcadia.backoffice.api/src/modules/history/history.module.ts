import { Module } from '@nestjs/common';
import {
  AlertRepository,
  ChangeRepository,
  connectionNames,
  DisputeRepository,
  GroupRepository,
  MachineRepository,
  OperatorRepository,
  PerformanceIndicatorRepository,
  PlayerRepository,
  SessionArchiveRepository,
  SessionRepository,
  TypeOrmModule,
  UserRepository,
  VoucherRepository,
} from 'arcadia-dal';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      AlertRepository,
      DisputeRepository,
      GroupRepository,
      MachineRepository,
      PerformanceIndicatorRepository,
      OperatorRepository,
      PlayerRepository,
      SessionRepository,
      SessionArchiveRepository,
      VoucherRepository,
    ], connectionNames.DATA),
    TypeOrmModule.forFeature([
      ChangeRepository,
    ], connectionNames.AUDIT),
  ],
  providers: [
    HistoryService,
  ],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}

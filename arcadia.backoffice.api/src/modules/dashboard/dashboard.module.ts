import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
  AlertRepository,
  DashboardDataRepository,
  MachineRepository,
  PlayerRepository, RoundArchiveEntity, RoundArchiveRepository,
  SessionArchiveRepository,
  SessionRepository,
} from 'arcadia-dal';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    provideRepository(DashboardDataRepository),
    provideRepository(SessionRepository),
    provideRepository(SessionArchiveRepository),
    provideRepository(PlayerRepository),
    provideRepository(MachineRepository),
    provideRepository(AlertRepository),
    provideRepository(RoundArchiveRepository),
  ],
})
export class DashboardModule {}
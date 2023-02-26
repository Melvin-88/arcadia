import { Module } from '@nestjs/common';
import {
  PerformanceDimensionRepository,
  PerformanceIndicatorRepository,
  PerformanceMetricRepository,
  PerformanceTrackerRepository,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { MonitoringsController } from './monitorings.controller';
import { MonitoringsService } from './monitorings.service';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
  ],
  controllers: [MonitoringsController],
  providers: [
    MonitoringsService,
    provideRepository(PerformanceIndicatorRepository),
    provideRepository(PerformanceMetricRepository),
    provideRepository(PerformanceDimensionRepository),
    provideRepository(PerformanceTrackerRepository),
  ],
})
export class MonitoringsModule {}

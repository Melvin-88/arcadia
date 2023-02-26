import { Module } from '@nestjs/common';
import { AlertRepository } from 'arcadia-dal';
import { LoggerModule } from '../logger/logger.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AuthModule } from '../auth/auth.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
  ],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    provideRepository(AlertRepository),
  ],
  exports: [
    AlertsService,
  ],
})
export class AlertsModule {}

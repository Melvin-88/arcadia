import { Module } from '@nestjs/common';
import { AlertRepository, MachineDispenserRepository } from 'arcadia-dal';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { AlertsModule } from '../alerts/alerts.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    AlertsModule,
  ],
  controllers: [
    MaintenanceController,
  ],
  providers: [
    MaintenanceService,
    provideRepository(AlertRepository),
    provideRepository(MachineDispenserRepository),
  ],
})
export class MaintenenceModule {}

import { Module } from '@nestjs/common';
import {
  AlertRepository,
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
} from 'arcadia-dal';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [],
  exports: [],
  providers: [
    AlertsService,
    {
      provide: getRepositoryToken(AlertRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(AlertRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [
    AlertsController,
  ],
})

export class AlertsModule {}

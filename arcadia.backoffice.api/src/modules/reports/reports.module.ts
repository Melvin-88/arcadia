import { HttpModule, Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  ProcessedReportRepository,
} from 'arcadia-dal';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ConfigService } from '../config/config.service';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async configService => ({
        baseURL: `http://${configService.get(['core', 'MONITORING_API_HOST'])}:${configService.get(['core', 'MONITORING_API_PORT'])}`,
        timeout: 3000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LoggerModule,
  ],
  exports: [],
  providers: [
    ReportsService,
    {
      provide: getRepositoryToken(ProcessedReportRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ProcessedReportRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [
    ReportsController,
  ],
})
export class ReportsModule {}

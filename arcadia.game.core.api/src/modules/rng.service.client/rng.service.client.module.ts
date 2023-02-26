import { HttpModule, Module } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  RoundArchiveRepository,
  RoundRepository,
  SeedHistoryRepository,
} from 'arcadia-dal';
import { ConfigService } from '../config/config.service';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { RngClientService } from './rng.client.service';
import { RngHelper } from './rng.helper';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const host = configService.get(['core', 'RNG_HOST']) as string;
        const port = configService.get(['core', 'RNG_PORT']) as string;
        return {
          baseURL: `http://${host}:${port}`,
          timeout: 3000,
        };
      },
      inject: [ConfigService],
    }),
    MonitoringWorkerClientModule,
  ],
  providers: [RngClientService, RngHelper,
    {
      provide: getRepositoryToken(SeedHistoryRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SeedHistoryRepository),
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
  ],
  exports: [RngClientService, RngHelper],
})
export class RngServiceClientModule {
}
import { HttpModule, Module } from '@nestjs/common';
import { MonitoringClientService } from './monitoring.client.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async configService => ({
        baseURL: `http://${configService.get(['core', 'MONITORING_API_HOST'])}:${configService.get(['core', 'MONITORING_API_PORT'])}`,
        timeout: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    MonitoringClientService,
  ],
  providers: [
    MonitoringClientService,
  ],
})
export class MonitoringClientModule {}

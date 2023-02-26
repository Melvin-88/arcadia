import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { OperatorApiClientService } from './operator.api.client.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async configService => ({
        baseURL: configService.get(['core', 'OPERATOR_SERVICE_API_URL']),
        timeout: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OperatorApiClientService],
  exports: [OperatorApiClientService],
})
export class OperatorApiClientModule {}

import { HttpModule, Module } from '@nestjs/common';
import { CoreClientService } from './coreClient.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async configService => ({
        baseURL: `http://${configService.get(['core', 'GAME_CORE_API_HOST'])}:${configService.get(['core', 'GAME_CORE_API_PORT'])}/api/v1/backoffice`,
        timeout: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CoreClientService],
  exports: [CoreClientService],
})
export class CoreClientModule {}

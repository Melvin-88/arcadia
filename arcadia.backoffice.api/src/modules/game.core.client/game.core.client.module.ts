import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { GameCoreClientService } from './game.core.client.service';

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
  exports: [
    GameCoreClientService,
  ],
  providers: [
    GameCoreClientService,
  ],
})
export class GameCoreClientModule {}

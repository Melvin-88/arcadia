import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LaunchUrlController } from './launch.url.controller';

@Module({
  imports: [HttpModule.registerAsync({
    useFactory: async configService => {
      const gameCoreApiHost = configService.get(['core', 'GAME_CORE_API_HOST']);
      const gameCoreApiPort = configService.get(['core', 'GAME_CORE_API_PORT']);
      const apiPrefix = '/api/v1';
      return {
        baseURL: (gameCoreApiHost && gameCoreApiPort)
          ? `http://${gameCoreApiHost}:${gameCoreApiPort}${apiPrefix}`
          : `http://localhost:3000${apiPrefix}`,
        timeout: 3000,
      };
    },
    inject: [ConfigService],
  })],
  controllers: [LaunchUrlController],
})
export class LaunchUrlModule {
}

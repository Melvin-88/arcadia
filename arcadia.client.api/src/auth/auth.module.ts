import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
        timeout: 5000,
      };
    },
    inject: [ConfigService],
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
}

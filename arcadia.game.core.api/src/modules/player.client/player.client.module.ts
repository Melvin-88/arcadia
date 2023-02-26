import { Global, Module } from '@nestjs/common';
import * as socketIo from 'socket.io-emitter';
import * as Redis from 'ioredis';
import { REDIS_PUBLISHER_CLIENT } from '../../constants/redis.constants';
import { ConfigService } from '../config/config.service';
import { PlayerClientService } from './player.client.service';
import { AppLogger } from '../logger/logger.service';

const playerClientPublisher = {
  provide: REDIS_PUBLISHER_CLIENT,
  useFactory: async (configService: ConfigService, logger: AppLogger): Promise<socketIo.SocketIOEmitter> => {
    const redisClient: any = new Redis(configService.getRedisConfig());
    const emitter: socketIo.SocketIOEmitter = socketIo(redisClient);
    redisClient.on('error', error => {
      logger.error(error.message, error.stack);
    });
    return emitter;
  },
  inject: [ConfigService, AppLogger],
};

@Global()
@Module({
  providers: [PlayerClientService, playerClientPublisher],
  exports: [PlayerClientService],
})
export class PlayerClientModule {
}

import {
  CACHE_MANAGER, CacheModule, Global, Module,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';

export const REDIS_CACHE = 'REDIS_CACHE';

@Global()
@Module({
  imports: [CacheModule.registerAsync({
    useFactory: async (config: ConfigService) => config.get('redisconfig'),
    inject: [ConfigService],
  }),
  ],
  providers: [{
    provide: REDIS_CACHE,
    useFactory: async manager => manager,
    inject: [CACHE_MANAGER],
  }],
  exports: [REDIS_CACHE],

})
export class RedisCacheModule {
}

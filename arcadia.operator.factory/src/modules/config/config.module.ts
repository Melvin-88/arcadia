import { Global, Module } from '@nestjs/common';
import 'reflect-metadata';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: async () => ConfigService.load(),
    }],
  exports: [ConfigService],
})
export class ConfigModule {

}

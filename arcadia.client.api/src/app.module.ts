import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { LaunchUrlModule } from './launch.url/launch.url.module';

@Module({
  imports: [
    ConfigModule.load('./.env'),
    AuthModule,
    HttpModule,
    LaunchUrlModule,
  ],
  controllers: [AppController],
})
export class AppModule {
}

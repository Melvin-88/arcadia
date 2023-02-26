import { Module } from '@nestjs/common';
import { SessionArchiveRepository, SessionRepository } from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { AuthModule } from '../auth/auth.module';
import { MonitoringClientModule } from '../monitoring.client/monitoring.client.module';
import { GameCoreClientModule } from '../game.core.client/game.core.client.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    MonitoringClientModule,
    GameCoreClientModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
  ],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    provideRepository(SessionRepository),
    provideRepository(SessionArchiveRepository),
  ],
})
export class SessionsModule {}

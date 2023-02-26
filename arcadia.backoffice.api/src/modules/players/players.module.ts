import { Module } from '@nestjs/common';
import {
  connectionNames,
  PlayerRepository,
  SessionRepository,
  TypeOrmModule,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    TypeOrmModule.forFeature([SessionRepository], connectionNames.DATA),
  ],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    provideRepository(PlayerRepository),
  ],
})
export class PlayersModule {}

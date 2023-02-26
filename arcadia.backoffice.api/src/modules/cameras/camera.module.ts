import {
  connectionNames, MachineRepository, SiteRepository, TypeOrmModule,
} from 'arcadia-dal';
import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { GameCoreClientModule } from '../game.core.client/game.core.client.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    HttpModule,
    GameCoreClientModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    TypeOrmModule.forFeature([MachineRepository], connectionNames.DATA),
    TypeOrmModule.forFeature([SiteRepository], connectionNames.DATA),
  ],
  controllers: [CamerasController],
  providers: [
    CamerasService,
  ],
})
export class CamerasModule {}

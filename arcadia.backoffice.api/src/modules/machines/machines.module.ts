import { Module } from '@nestjs/common';
import {
  ChipRepository,
  connectionNames,
  GroupRepository,
  MachineRepository,
  QueueRepository,
  SiteRepository,
  TypeOrmModule,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { AuthModule } from '../auth/auth.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { GameCoreClientModule } from '../game.core.client/game.core.client.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    TypeOrmModule.forFeature([SiteRepository, ChipRepository], connectionNames.DATA),
    GameCoreClientModule,
  ],
  controllers: [MachinesController],
  providers: [
    MachinesService,
    provideRepository(MachineRepository),
    provideRepository(GroupRepository),
    provideRepository(QueueRepository),
    provideRepository(SiteRepository),
    provideRepository(ChipRepository),
  ],
})
export class MachinesModule {}

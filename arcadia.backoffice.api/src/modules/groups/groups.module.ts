import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GroupRepository, RngChipPrizeRepository } from 'arcadia-dal';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { AuthModule } from '../auth/auth.module';
import { GameCoreClientModule } from '../game.core.client/game.core.client.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    GameCoreClientModule,
  ],
  exports: [
    GroupsService,
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    provideRepository(GroupRepository),
    provideRepository(RngChipPrizeRepository),
  ],
})
export class GroupsModule {
}

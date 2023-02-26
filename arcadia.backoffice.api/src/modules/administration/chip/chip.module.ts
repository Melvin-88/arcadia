import { Module } from '@nestjs/common';
import { ChipRepository, ChipTypeRepository, SiteRepository } from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { provideRepository } from '../../../helpers/repositoryProviderGenerator';
import { ChipController } from './chip.controller';
import { LoggerModule } from '../../logger/logger.module';
import { AuthModule } from '../../auth/auth.module';
import { ChipService } from './chip.service';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
  ],
  controllers: [ChipController],
  providers: [
    ChipService,
    provideRepository(ChipRepository),
    provideRepository(SiteRepository),
    provideRepository(ChipTypeRepository),
  ],
  exports: [ChipService],
})
export class ChipModule {}

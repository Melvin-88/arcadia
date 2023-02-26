import { Module } from '@nestjs/common';
import {
  connectionNames,
  CurrencyConversionRepository,
  DisputeRepository,
  OperatorRepository,
  PlayerRepository,
  SessionArchiveRepository,
  TypeOrmModule,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { AuthModule } from '../auth/auth.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    TypeOrmModule.forFeature([
      SessionArchiveRepository,
      PlayerRepository,
      OperatorRepository,
    ], connectionNames.DATA),
  ],
  controllers: [DisputesController],
  providers: [
    DisputesService,
    provideRepository(DisputeRepository),
    provideRepository(CurrencyConversionRepository),
  ],
})
export class DisputesModule {}

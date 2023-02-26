import { Module } from '@nestjs/common';
import { GroupRepository, LogoRepository, OperatorRepository } from 'arcadia-dal';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { AuthModule } from '../auth/auth.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 2, // bytes
      },
    }),
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
  ],
  controllers: [OperatorsController],
  providers: [
    OperatorsService,
    provideRepository(OperatorRepository),
    provideRepository(GroupRepository),
    provideRepository(LogoRepository),
  ],
})
export class OperatorsModule {}

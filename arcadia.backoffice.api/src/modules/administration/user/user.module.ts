import { Module } from '@nestjs/common';
import {
  ActionRepository,
  BoModuleRepository, connectionNames, TypeOrmModule, UserRepository,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../../logger/logger.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../../auth/auth.module';
import { provideRepository } from '../../../helpers/repositoryProviderGenerator';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer', session: false }),
    TypeOrmModule.forFeature([BoModuleRepository], connectionNames.DATA),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    provideRepository(UserRepository),
    provideRepository(BoModuleRepository),
    provideRepository(ActionRepository, true),
  ],
})
export class UserModule {}

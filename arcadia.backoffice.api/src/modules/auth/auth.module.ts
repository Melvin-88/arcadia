import { Module } from '@nestjs/common';
import {
  UserRepository,
  TypeOrmModule,
  connectionNames,
  BoModuleRepository,
  OperatorRepository,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerModule } from '../logger/logger.module';
import { BearerStrategy } from './strategies/bearer.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { BearerVoucherPortalStrategy } from './strategies/bearer.voucher.portal.strategy';
import { LocalVoucherPortalStrategy } from './strategies/local.voucher.portal.strategy';

export const passportModule = PassportModule.register({ defaultStrategy: 'bearer', session: false });

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([UserRepository, BoModuleRepository, OperatorRepository], connectionNames.DATA),
    passportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BearerStrategy,
    LocalStrategy,
    BearerVoucherPortalStrategy,
    LocalVoucherPortalStrategy,
  ],
  exports: [
    AuthService,
    BearerStrategy,
    LocalStrategy,
    BearerVoucherPortalStrategy,
    LocalVoucherPortalStrategy,
  ],
})
export class AuthModule {}

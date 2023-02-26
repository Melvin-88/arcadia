import { Module } from '@nestjs/common';
import { VoucherRepository } from 'arcadia-dal';
import { LoggerModule } from '../logger/logger.module';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
  ],
  controllers: [VouchersController],
  providers: [
    VouchersService,
    provideRepository(VoucherRepository),
  ],
  exports: [
    VouchersService,
  ],
})
export class VouchersModule {}

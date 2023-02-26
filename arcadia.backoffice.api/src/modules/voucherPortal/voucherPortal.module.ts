import { Module } from '@nestjs/common';
import {
  connectionNames, GroupRepository, PlayerRepository,
  TypeOrmModule,
  VoucherRepository,
} from 'arcadia-dal';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { provideRepository } from '../../helpers/repositoryProviderGenerator';
import { VoucherPortalService } from './voucherPortal.service';
import { VoucherPortalController } from './voucherPortal.controller';
import { AuthModule } from '../auth/auth.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    VouchersModule,
    GroupsModule,
    PassportModule.register({ defaultStrategy: 'voucherPortalBearer', session: false }),
    TypeOrmModule.forFeature([GroupRepository, PlayerRepository], connectionNames.DATA),
  ],
  controllers: [VoucherPortalController],
  providers: [
    VoucherPortalService,
    provideRepository(VoucherRepository),
  ],
})
export class VoucherPortalModule {}

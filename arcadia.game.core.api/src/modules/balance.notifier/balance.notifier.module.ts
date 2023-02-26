import { Module } from '@nestjs/common';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { PlayerClientModule } from '../player.client/player.client.module';
import { BalanceNotifier } from './balance.notifier';

@Module({
  imports: [SessionDataManagerModule, OperatorApiClientModule, PlayerClientModule],
  providers: [BalanceNotifier],
  exports: [BalanceNotifier],
})
export class BalanceNotifierModule {

}

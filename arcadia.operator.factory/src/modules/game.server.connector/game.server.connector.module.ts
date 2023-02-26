import { Module } from '@nestjs/common';
import 'reflect-metadata';
import { OperatorFactoryModule } from '../adapter.factory/operator.factory.module';
import { GameServerController } from './game.server.controller';
import { InfoController } from './info.controller';
import { RabbitmqConnectorModule } from '../rabbitmq.connector/rabbitmq.connector.module';

@Module({
  imports: [OperatorFactoryModule.register(), RabbitmqConnectorModule],
  controllers: [GameServerController, InfoController],
})
export class GameServerConnectorModule {
}

import { Module } from '@nestjs/common';
import { RabbitmqConnectorService } from './rabbitmq.connector.service';

@Module({
  exports: [RabbitmqConnectorService],
  providers: [RabbitmqConnectorService],
})
export class RabbitmqConnectorModule {}

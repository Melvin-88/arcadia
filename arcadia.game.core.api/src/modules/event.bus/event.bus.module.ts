import { Global, Module } from '@nestjs/common';
import { EventBusPublisher } from './event.bus.publisher';

@Global()
@Module({
  providers: [EventBusPublisher],
  exports: [EventBusPublisher],
})
export class EventBusModule {

}
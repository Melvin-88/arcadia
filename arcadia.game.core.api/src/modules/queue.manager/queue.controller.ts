import {
  Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../interceptors/app';
import { BusEventType } from '../event.bus/bus.event.type';
import { QueueUpdatesEvent } from '../event.bus/dto/queue.updates.event';
import { Route } from '../rmq.server/route';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { QueueManagerService } from './queue.manager.service';

@Controller({ path: 'v1/queues' })
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class QueueController {
  constructor(
    private readonly queueManager: QueueManagerService,
  ) {
  }

  @MessagePattern(`${Route.EVENT_BUS}.${BusEventType.QUEUE_UPDATES.toLowerCase()}`)
  public async queueUpdate(@Payload() data: QueueUpdatesEvent): Promise<void> {
    await this.queueManager.notifyQueueUpdate(data.queueId, data.session);
  }
}
import {
  Controller,
  Scope,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../interceptors/app';
import { BusEventType } from '../event.bus/bus.event.type';
import { ChangeQueueEvent } from '../event.bus/dto/change.queue.event';
import { SessionInjectorPipe } from '../messaging/player.handling/session.injector.pipe';
import { Route } from '../rmq.server/route';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { QueueChangeHandler } from './queue.change.handler';

@Controller({ path: 'v1/queuesTrans', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class QueueTransactionController {
  constructor(
    private readonly queueChangeHandler: QueueChangeHandler,
  ) {
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.EVENT_BUS}.${BusEventType.CHANGE_QUEUE.toLowerCase()}`)
  public async queueChange(@Payload() data: ChangeQueueEvent): Promise<void> {
    await this.queueChangeHandler.handle(data);
  }
}
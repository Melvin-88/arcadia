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
import { FinalizeSessionEvent } from '../event.bus/dto/finalize.session.event';
import { SessionInjectorPipe } from '../messaging/player.handling/session.injector.pipe';
import { Route } from '../rmq.server/route';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { SessionTerminator } from './session.terminator';

@Controller({ path: 'v1/terminator', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}), SessionInjectorPipe)
export class TerminatorController {
  constructor(
    private readonly sessionTerminator: SessionTerminator,
  ) {
  }

  @MessagePattern(`${Route.EVENT_BUS}.${BusEventType.TERMINATE_SESSION.toLowerCase()}`)
  public async terminateSession(@Payload() data: FinalizeSessionEvent): Promise<void> {
    await this.sessionTerminator.handle(data);
  }
}

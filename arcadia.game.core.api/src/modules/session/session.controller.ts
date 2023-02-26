import {
  Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../interceptors/app';
import { BusEventType } from '../event.bus/bus.event.type';
import { FinalizeSessionEvent } from '../event.bus/dto/finalize.session.event';
import { Route } from '../rmq.server/route';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { SessionService } from './session.service';

@Controller({ path: 'v1/session' })
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
  }

  @MessagePattern(`${Route.EVENT_BUS}.${BusEventType.FINALIZE_SESSION.toLowerCase()}`)
  public async finalizeSession(@Payload() data: FinalizeSessionEvent): Promise<void> {
    await this.sessionService.finalizeSession(data.sessionId, data.terminate, data.reason);
  }
}

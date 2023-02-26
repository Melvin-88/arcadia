import {
  Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../interceptors/app';
import { RobotErrorMessage } from '../messaging/robot.handling/dto/robotErrorMessage';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { RobotErrorHandler } from './robotErrorHandler';

@Controller('v1/robotError')
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class RobotErrorController {
  constructor(
    private readonly errorHandler: RobotErrorHandler,
  ) {
  }

  @MessagePattern('Robot.error')
  async robotError(@Payload() data: RobotErrorMessage): Promise<void> {
    await this.errorHandler.handleError(data);
  }
}

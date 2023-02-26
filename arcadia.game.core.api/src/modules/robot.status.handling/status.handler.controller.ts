import {
  Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../interceptors/app';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { RobotStatusDto } from './dto/robot.status.dto';
import { StatusHandlerService } from './status.handler.service';

@Controller('v1/robots/status')
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class StatusHandlerController {
  constructor(
    private readonly statusHandler: StatusHandlerService,
  ) {
  }

  @MessagePattern('Robot.status')
  async handleStatus(@Payload() data: RobotStatusDto): Promise<void> {
    await this.statusHandler.handleStatus(data.status.application, data.serial);
  }
}

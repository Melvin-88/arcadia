import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { rpcValidationExceptionFactory } from './exceptions/rpcvalidation.factory';
import { RpcValidationExceptionFilter } from './filters/rpcValidationException.filter';
import { EventDto, RobotEventDto } from './modules/dto';
import { AppLogger } from './modules/logger/logger.service';
import { AlertDto } from './modules/dto/alert.dto';
import { ReportsService } from './modules/reports/reports.service';

@Controller()
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
@UseFilters(RpcValidationExceptionFilter)
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  public getHealth() {
    return {};
  }

  @MessagePattern('Core.eventlog')
  public async handlePlayerEvent(@Payload() data: EventDto, @Ctx() context: RmqContext) {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handleEventLog(data);
  }

  @MessagePattern('Core.roboteventlog')
  public async handleRobotEvent(@Payload() data: RobotEventDto, @Ctx() context: RmqContext) {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handleRobotEventLog(data);
  }

  @MessagePattern('Core.createalert')
  public async createAlert(@Payload() data: AlertDto, @Ctx() context: RmqContext) {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.createAlert(data);
  }

  @MessagePattern('Core.preparereport')
  public prepareActivityReport(@Payload() payload: any, @Ctx() context: RmqContext): void {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(payload)}`);
    this.reportsService.prepareReport(payload.data);
  }
}

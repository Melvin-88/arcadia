/* eslint-disable max-lines */
import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../../interceptors/app';
import { BusEventType } from '../../event.bus/bus.event.type';
import { EngageSessionEvent } from '../../event.bus/dto/engage.session.event';
import { Route } from '../../rmq.server/route';
import { rpcValidationExceptionFactory } from '../../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../../rpc.exception.handler/filters/rpc.main.exception.filter';
import { SessionInjectorPipe } from '../player.handling/session.injector.pipe';
import {
  RobotChipRemovedDto,
  RobotChipValidationDto,
  RobotPositionDto,
  RobotToCoreBaseMessage,
} from './dto';
import { RobotChipPushedDto } from './dto/robot.chip.pushed.dto';
import { RobotMessageService } from './robot.message.service';

@Controller('v1/robots')
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class RobotMessageController {
  constructor(
    private readonly messageHandler: RobotMessageService,
  ) {
  }

  @Get('/login')
  public async loginRobot(
    @Query('serial') serial: string,
    @Query('key') secret: string,
    @Query('env') env: string | undefined,
  ): Promise<void> {
    return this.messageHandler.loginRobot(serial, secret, env);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Robot.engaged')
  async clientEngagedHandler(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    await this.messageHandler.handleEngaged(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Robot.disengaged')
  async clientDisengagedHandler(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    await this.messageHandler.handleDisengaged(data);
  }

  @MessagePattern('Robot.position')
  async positionHandler(@Payload() data: RobotPositionDto): Promise<void> {
    await this.messageHandler.handlePosition(data);
  }

  @MessagePattern('Robot.chipvalidation')
  async chipValidationHandler(@Payload() data: RobotChipValidationDto): Promise<void> {
    await this.messageHandler.handleChipValidation(data.serial, data.rfid);
  }

  @MessagePattern('Robot.chipremoved')
  async chipRemovedHandler(@Payload() data: RobotChipRemovedDto): Promise<void> {
    await this.messageHandler.handleChipRemoved(data.rfid, data.serial);
  }

  @MessagePattern('Robot.chippushed')
  async chipPushedHandler(@Payload() data: RobotChipPushedDto): Promise<void> {
    await this.messageHandler.handleChipPushed(data.serial, data.rfid, data.pending, data.correlationId);
  }

  @MessagePattern('Robot.outofchips')
  async outOfChipsHandler(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    await this.messageHandler.handleOutOfChips(data.serial);
  }

  @MessagePattern('Robot.pong')
  async pongHandler(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    await this.messageHandler.handlePong(data.serial);
  }

  @MessagePattern('Worker.pingoutdated')
  async pingOutdatedHandler(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    await this.messageHandler.handlePingOutdated(data.serial, data.correlationId);
  }

  @MessagePattern(`${Route.EVENT_BUS}.${BusEventType.ENGAGE_SESSION.toLowerCase()}`)
  async engageSession(@Payload() data: EngageSessionEvent): Promise<void> {
    await this.messageHandler.engageNextSession(data.machineId, data.reBuySessionId, data.correlationId);
  }
}

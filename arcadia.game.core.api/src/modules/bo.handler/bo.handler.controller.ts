import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { CORRELATION_ID_HEADER } from '../../constants/logging.constants';
import { MainAppInterceptor } from '../../interceptors/app';
import { AppLogger } from '../logger/logger.service';
import { VideoApiTokenResponse } from './bo.handler.interface';
import { BoHandlerService } from './bo.handler.service';
import { GroupStopDto } from './dto/group.stop.dto';
import { MachineReassignDto } from './dto/machine.reassign.dto';
import { MachineStartDto } from './dto/machine.start.dto';
import { MachineStartResponseDto } from './dto/machine.start.response.dto';

@ApiTags('Backoffice')
@UseInterceptors(MainAppInterceptor)
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('v1/backoffice')
export class BoHandlerController {
  constructor(
    private readonly boHandler: BoHandlerService,
    private readonly logger: AppLogger,
  ) {
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/group/:id/softStop')
  public groupSoftStop(
    @Param('id', ParseIntPipe) groupId: number,
    @Body()data: GroupStopDto,
    @Headers(CORRELATION_ID_HEADER) corrId: string,
  ): Promise<any> {
    this.logger.log(`Group soft stop: groupId=${groupId}, data=${JSON.stringify(data)}, correlationId=${corrId}`);
    return this.boHandler.groupSoftStopHandler(groupId, data?.machineIds, corrId);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/group/:id/hardStop')
  public groupHardStop(
    @Param('id', ParseIntPipe) groupId: number,
    @Body()data: GroupStopDto,
    @Headers(CORRELATION_ID_HEADER) corrId: string,
  ): Promise<any> {
    this.logger.log(`Group hard stop: groupId=${groupId}, data=${JSON.stringify(data)}, correlationId=${corrId}`);
    return this.boHandler.groupHardStopHandler(groupId, data?.machineIds, corrId);
  }

  @ApiCreatedResponse({ description: 'Success', type: MachineStartResponseDto })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/machine/:id/start')
  public machineStart(
    @Param('id', ParseIntPipe) machineId: number,
    @Body()data: MachineStartDto,
    @Headers(CORRELATION_ID_HEADER) corrId: string,
  ): Promise<MachineStartResponseDto> {
    this.logger.log(`Machine start: machineId=${machineId}, data=${JSON.stringify(data)}, correlationId=${corrId}`);
    return this.boHandler.machineStartHandler(machineId, data, corrId);
  }

  @ApiCreatedResponse({ description: 'Success', type: MachineReassignDto })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/machine/:id/reassign')
  public machineReassign(
    @Param('id', ParseIntPipe) machineId: number,
    @Body()data: MachineReassignDto,
    @Headers(CORRELATION_ID_HEADER) corrId: string,
  ): Promise<MachineReassignDto> {
    this.logger.log(`Machine reassign: machineId=${machineId}, data=${JSON.stringify(data)}, correlationId=${corrId}`);
    return this.boHandler.machineReassign(machineId, data.groupId);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/machine/:id/reboot')
  public machineReboot(
    @Param('id', ParseIntPipe) machineId: number,
    @Headers(CORRELATION_ID_HEADER) corrId: string,
  ): Promise<any> {
    this.logger.log(`Machine reboot: machineId=${machineId}, correlationId=${corrId}`);
    return this.boHandler.machineReboot(machineId);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post('/session/:id/terminate')
  public terminateSession(
    @Param('id', ParseIntPipe) sessionId: number,
    @Headers(CORRELATION_ID_HEADER) correlationId: string,
  ): Promise<number> {
    this.logger.log(`Terminate session: sessionId=${sessionId}, correlationId=${correlationId}`);
    return this.boHandler.terminateSession(sessionId, correlationId);
  }

  @ApiOkResponse({ description: 'Returns video api token' })
  @ApiNotFoundResponse({ description: 'Site not found' })
  @ApiImplicitParam({ name: 'id', description: 'Site id' })
  @Get('/video/token/:id')
  public getVideoApiToken(@Param('id', ParseIntPipe) id: number): Promise<VideoApiTokenResponse> {
    return this.boHandler.getVideoApiToken(id);
  }
}

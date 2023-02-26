import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Optional,
  Param,
  Post,
  Put,
  Query,
  Scope,
  UseInterceptors,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { MonitoringsService } from './monitorings.service';
import { DimensionsResponse, MetricsResponse, MonitoringsResponse } from './monitorings.interface';
import { CreateMonitoringDto, EditMonitoringDto } from './monitorings.dto';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../guards';
import { ModuleTags } from '../../enums';

@ApiTags('monitorings')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@Controller({ path: 'monitorings', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class MonitoringsController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(MonitoringsService) private readonly monitoringsService: MonitoringsService,
    @Optional() @Inject(REQUEST) private request,
  ) {
    this.contextId = this.request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiOkResponse({ description: 'Returns monitorings data', type: MonitoringsResponse })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for monitoring\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'segments', description: 'Filter for monitoring\'s segment', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'segmentSubsetGroup', description: 'Filter for monitoring\'s segment subset', type: String,
  })
  @ApiImplicitQuery({
    required: false,
    name: 'segmentSubsetMachine',
    description: 'Filter for monitoring\'s segment subset',
    type: String,
  })
  @ApiImplicitQuery({
    required: false,
    name: 'segmentSubsetOperator',
    description: 'Filter for monitoring\'s segment subset',
    type: String,
  })
  @ApiImplicitQuery({
    required: false, name: 'mode', description: 'Filter for monitoring\'s mode', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'metric', description: 'Filter for monitoring\'s metric', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'dimension', description: 'Filter for monitoring\'s dimension subset', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'targetValueFrom', description: 'Filter for monitoring\'s target value' })
  @ApiImplicitQuery({ required: false, name: 'targetValueTo', description: 'Filter for monitoring\'s target value' })
  @ApiImplicitQuery({
    required: false,
    name: 'currentValueFrom',
    description: 'Filter for monitoring\'s current value',
  })
  @ApiImplicitQuery({ required: false, name: 'currentValueTo', description: 'Filter for monitoring\'s current value' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  public getMonitorings(@Query() query: any): Promise<MonitoringsResponse> {
    return this.monitoringsService.getMonitorings(query, this.contextId);
  }

  @Get('/metrics')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiOkResponse({ description: 'Returns all available metrics', type: MetricsResponse })
  public getMetrics(): Promise<MetricsResponse> {
    return this.monitoringsService.getMetrics(this.contextId);
  }

  @Get('/dimensions')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiOkResponse({ description: 'Returns all available dimensions', type: DimensionsResponse })
  public getDimensions(): Promise<DimensionsResponse> {
    return this.monitoringsService.getDimensions(this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @UseGuards(PasswordRequiredGuard)
  public createMonitoring(@Body() data: CreateMonitoringDto): Promise<void> {
    return this.monitoringsService.createMonitoring(data, this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  public editMonitoring(@Param() params: any, @Body() data: EditMonitoringDto): Promise<void> {
    return this.monitoringsService.editMonitoring(params.id, data, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  public removeMonitoring(@Param() params: any): Promise<void> {
    return this.monitoringsService.removeMonitoring(params.id, this.contextId);
  }
}

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Optional,
  Param,
  Post,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { AlertResponse, AlertsResponse } from './alerts.interface';
import { AlertsService } from './alerts.service';
import { MainAppInterceptor } from '../../interceptors/app';
import { ModuleAccessGuard } from '../../guards';
import { AlertJsonEditDto } from './alerts.dto';
import { ModuleTags } from '../../enums';

@ApiTags('alerts')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'alerts', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class AlertsController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(AlertsService) private readonly alertsService: AlertsService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.ALERTS)
  @ApiOkResponse({ description: 'Returns alerts data', type: AlertsResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for alert\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for alert\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'type', description: 'Filter for alert\'s type', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'severity', description: 'Filter for alert\'s severity', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'isFlagged', description: 'Filter for alert\'s flag status', type: [Boolean],
  })
  @ApiImplicitQuery({ required: false, name: 'source', description: 'Filter for alert\'s source' })
  @ApiImplicitQuery({ required: false, name: 'dateFrom', description: 'Filter for alert\'s date and time' })
  @ApiImplicitQuery({ required: false, name: 'dateTo', description: 'Filter for alert\'s date and time' })
  @ApiImplicitQuery({ required: false, name: 'description', description: 'Filter for alert\'s description' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getAlerts(@Query() query: any): Promise<AlertsResponse> {
    return this.alertsService.getAlerts(query, this.contextId);
  }

  @Post('/:id/dismiss')
  @SetMetadata('tag', ModuleTags.ALERTS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated alerts data', type: AlertResponse })
  public dismissAlert(@Param() params: any): Promise<AlertResponse> {
    return this.alertsService.dismissAlert(params.id, this.contextId);
  }

  @Post('/:id/flag')
  @SetMetadata('tag', ModuleTags.ALERTS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated alerts data', type: AlertResponse })
  public flagAlert(@Param() params: any): Promise<AlertResponse> {
    return this.alertsService.flagAlert(params.id, this.contextId);
  }

  @Post('/:id/json')
  @SetMetadata('tag', ModuleTags.ALERTS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated alerts data', type: AlertResponse })
  public editJson(@Body() data: AlertJsonEditDto, @Param() params: any): Promise<AlertResponse> {
    return this.alertsService.editJson(params.id, data.additionalInfo, this.contextId);
  }
}

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
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
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ModuleAccessGuard } from '../../guards';
import { MainAppInterceptor } from '../../interceptors/app';
import { MaintenanceAlertResponse, MaintenanceAlertsResponse } from './maintenance.interface';
import { MaintenanceService } from './maintenance.service';
import { ModuleTags } from '../../enums';

@ApiTags('maintenance')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'maintenance', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class MaintenanceController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(MaintenanceService) private readonly maintenanceService: MaintenanceService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.MAINTENANCE)
  @ApiOkResponse({ description: 'Returns alerts data', type: MaintenanceAlertsResponse })
  @ApiImplicitQuery({
    required: false, name: 'type', description: 'Filter for alert\'s type', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'severity', description: 'Filter for alert\'s severity', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'dateFrom', description: 'Filter for alert\'s date and time' })
  @ApiImplicitQuery({ required: false, name: 'dateTo', description: 'Filter for alert\'s date and time' })
  @ApiImplicitQuery({ required: false, name: 'description', description: 'Filter for alert\'s description' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getAlerts(@Query() query: any): Promise<MaintenanceAlertsResponse> {
    return this.maintenanceService.getAlerts(query, this.contextId);
  }

  @Post('/:id/dismiss')
  @SetMetadata('tag', ModuleTags.MAINTENANCE)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated alerts data',
    type: MaintenanceAlertResponse,
  })
  public dismissAlert(@Param() params: any): Promise<MaintenanceAlertResponse> {
    return this.maintenanceService.dismissAlert(params.id, this.contextId);
  }

  @Post('/:id/dispenserFilled')
  @SetMetadata('tag', ModuleTags.MAINTENANCE)
  @ApiImplicitParam({ name: 'id' })
  public dispenserFilled(@Param() params: any): Promise<void> {
    return this.maintenanceService.dispenserFilled(params.id, this.contextId);
  }

  @Post('/:id/waistEmptied')
  @SetMetadata('tag', ModuleTags.MAINTENANCE)
  @ApiImplicitParam({ name: 'id' })
  public waistEmptied(@Param() params: any): Promise<void> {
    return this.maintenanceService.waistEmptied(params.id, this.contextId);
  }
}

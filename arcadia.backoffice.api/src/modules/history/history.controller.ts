import {
  Controller,
  Get,
  Param,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ModuleAccessGuard } from '../../guards';
import { MainAppInterceptor } from '../../interceptors/app';
import { HistoryService } from './history.service';
import { EntitiesHistoryResponse } from './history.interface';
import { ModuleTags } from '../../enums';
import { HistoryEntities } from './enums/history.entities';

@ApiTags('history')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller('history')
@UseInterceptors(MainAppInterceptor)
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
  ) {}

  @Get(`/${HistoryEntities.GROUPS}/:id?`)
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiOkResponse({ description: 'Returns groups history data for provided id or all records id is is not provided', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getGroupsHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.GROUPS, id);
  }

  @Get(`/${HistoryEntities.MACHINES}/:id?`)
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiOkResponse({ description: 'Returns machines history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getMachinesHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.MACHINES, id);
  }

  @Get(`/${HistoryEntities.CAMERAS}/:id?`)
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiOkResponse({ description: 'Returns cameras history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getCamerasHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.CAMERAS, id);
  }

  @Get(`/${HistoryEntities.VOUCHERS}/:id?`)
  @SetMetadata('tag', ModuleTags.VOUCHERS)
  @ApiOkResponse({ description: 'Returns vouchers history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getVouchersHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.VOUCHERS, id);
  }

  @Get(`/${HistoryEntities.OPERATORS}/:id?`)
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiOkResponse({ description: 'Returns operators history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getOperatorsHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.OPERATORS, id);
  }

  @Get(`/${HistoryEntities.ALERTS}/:id?`)
  @SetMetadata('tag', ModuleTags.ALERTS)
  @ApiOkResponse({ description: 'Returns alerts history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getAlertsHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.ALERTS, id);
  }

  @Get(`/${HistoryEntities.DISPUTES}/:id?`)
  @SetMetadata('tag', ModuleTags.DISPUTES)
  @ApiOkResponse({ description: 'Returns disputes history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getDisputesHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.DISPUTES, id);
  }

  @Get(`/${HistoryEntities.MAINTENANCE}/:id?`)
  @SetMetadata('tag', ModuleTags.MAINTENANCE)
  @ApiOkResponse({ description: 'Returns maintenance history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getMaintenanceHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.MAINTENANCE, id);
  }

  @Get(`/${HistoryEntities.MONITORING}/:id?`)
  @SetMetadata('tag', ModuleTags.MONITORING)
  @ApiOkResponse({ description: 'Returns monitoring history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getMonitoringHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.MONITORING, id);
  }

  @Get(`/${HistoryEntities.ADMINISTRATION}/:id?`)
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiOkResponse({ description: 'Returns administration history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getAdministrationHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.ADMINISTRATION, id);
  }

  @Get(`/${HistoryEntities.PLAYERS}/:id?`)
  @SetMetadata('tag', ModuleTags.PLAYERS)
  @ApiOkResponse({ description: 'Returns players history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getPlayersHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.PLAYERS, id);
  }

  @Get(`/${HistoryEntities.SESSIONS}/:id?`)
  @SetMetadata('tag', ModuleTags.SESSIONS)
  @ApiOkResponse({ description: 'Returns sessions history data', type: EntitiesHistoryResponse })
  @ApiImplicitParam({ required: false, name: 'id', description: 'Entity\'s id' })
  @ApiImplicitQuery({ required: false, name: 'startDate', description: 'Take history from data' })
  @ApiImplicitQuery({ required: false, name: 'endDate', description: 'Take history to date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getSessionsHistory(@Query() query: any, @Param('id') id: string): Promise<EntitiesHistoryResponse> {
    return this.historyService.getEntityHistory(query, HistoryEntities.SESSIONS, id);
  }
}

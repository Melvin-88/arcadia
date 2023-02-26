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
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { SessionsService } from './sessions.service';
import { SessionResponse, SessionsResponse } from './sessions.interface';
import { EventLogsResponse } from '../monitoring.client/monitoring.client.interface';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard } from '../../guards';

@ApiTags('sessions')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'sessions', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class SessionsController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(SessionsService) private readonly sessionsService: SessionsService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.SESSIONS)
  @ApiOkResponse({ description: 'Returns sessions data', type: SessionsResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for session\'s id' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for session\'s machine id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for session\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'groupName', description: 'Filter for session\'s group name', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'operatorName', description: 'Filter for session\'s operator name', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'playerCid', description: 'Filter for session\'s player cid' })
  @ApiImplicitQuery({ required: false, name: 'startDateFrom', description: 'Filter for session\'s start date & time' })
  @ApiImplicitQuery({ required: false, name: 'startDateTo', description: 'Filter for session\'s start date & time' })
  @ApiImplicitQuery({ required: false, name: 'durationFrom', description: 'Filter for session\'s duration' })
  @ApiImplicitQuery({ required: false, name: 'durationTo', description: 'Filter for session\'s duration' })
  @ApiImplicitQuery({ required: false, name: 'roundsFrom', description: 'Filter for session\'s rounds count' })
  @ApiImplicitQuery({ required: false, name: 'roundsTo', description: 'Filter for session\'s rounds count' })
  @ApiImplicitQuery({
    required: false,
    name: 'totalWinningFrom',
    description: 'Filter for session\'s total winning count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'totalWinningTo',
    description: 'Filter for session\'s total winning count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'totalNetCashFrom',
    description: 'Filter for session\'s total net cash count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'totalNetCashTo',
    description: 'Filter for session\'s total net cash count',
  })
  @ApiImplicitQuery({ required: false, name: 'ip', description: 'Filter for session\'s ip address' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getSessions(@Query() query: any): Promise<SessionsResponse> {
    return this.sessionsService.getSessions(query, this.contextId);
  }

  @Post('/:id/terminate')
  @SetMetadata('tag', ModuleTags.SESSIONS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated sessions data', type: SessionResponse })
  public terminateSession(@Param() params: any): Promise<SessionResponse> {
    return this.sessionsService.terminateSession(params.id, this.contextId);
  }

  @Get('/:id/eventLogs')
  @SetMetadata('tag', ModuleTags.SESSIONS)
  @ApiImplicitParam({ name: 'id' })
  @ApiOkResponse({ description: 'Returns event logs for session', type: EventLogsResponse })
  @ApiImplicitQuery({
    required: false, name: 'source', description: 'Filter for logs\'s source', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'type', description: 'Filter for logs\'s type' })
  @ApiImplicitQuery({ required: false, name: 'dateFrom', description: 'Filter for logs\'s creation date' })
  @ApiImplicitQuery({ required: false, name: 'dateTo', description: 'Filter for logs\'s creation date' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  public getEventLogs(@Query() query: any, @Param() params: any): Promise<EventLogsResponse> {
    return this.sessionsService.getEventLogs(parseInt(params.id, 10), query);
  }
}

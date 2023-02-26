import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Optional,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { ModuleAccessGuard } from '../../guards';
import { MainAppInterceptor } from '../../interceptors/app';
import { ModuleTags } from '../../enums';
import { DashboardService } from './dashboard.service';
import {
  ActiveNewPlayersResponse,
  ActiveSessionsBreakdownResponse,
  BettingActivityResponse,
  ExistingNewPlayersResponse,
  LatestAlertsResponse,
  MachineAvailabilityResponse,
  ThirtyDaysActiveNewPlayersResponse, TopWinnersLosersResponse,
  WaitTimeResponse,
} from './dashboard.interface';

@ApiTags('dashboard')
@Controller({ path: 'dashboard', scope: Scope.REQUEST })
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class DashboardController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(DashboardService) private readonly dashboardService: DashboardService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('activeNewPlayers')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns new/active players widget data',
    type: ActiveNewPlayersResponse,
  })
  public activeNewPlayers(): Promise<ActiveNewPlayersResponse> {
    return this.dashboardService.activeNewPlayers(this.contextId);
  }

  @Get('existingNewPlayers')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns existing/new players widget data',
    type: ExistingNewPlayersResponse,
  })
  public existingNewPlayers(): Promise<ExistingNewPlayersResponse> {
    return this.dashboardService.existingNewPlayers(this.contextId);
  }

  @Get('activeSessionsBreakdown')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns active sessions breakdown widget data',
    type: ActiveSessionsBreakdownResponse,
  })
  public activeSessionsBreakdown(): Promise<ActiveSessionsBreakdownResponse> {
    return this.dashboardService.activeSessionsBreakdown(this.contextId);
  }

  @Get('machineAvailability')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns machine availability widget data',
    type: MachineAvailabilityResponse,
  })
  public machineAvailability(@Query('groupId') groupIds: string[]): Promise<MachineAvailabilityResponse> {
    if (groupIds && !Array.isArray(groupIds)) {
      groupIds = [groupIds];
    }
    return this.dashboardService.machineAvailability(this.contextId, groupIds);
  }

  @Get('machinesStatus')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns machines status widget data',
    type: MachineAvailabilityResponse,
  })
  public machinesStatus(@Query('groupId') groupIds: string[]): Promise<MachineAvailabilityResponse> {
    return this.dashboardService.machinesStatus(this.contextId, groupIds);
  }

  @Get('latestAlerts')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns latest alerts widget data', type: LatestAlertsResponse })
  public latestAlerts(): Promise<LatestAlertsResponse> {
    return this.dashboardService.latestAlerts(this.contextId);
  }

  @Get('waitTime')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns wait time widget data', type: WaitTimeResponse })
  public waitTime(@Query('groupId') groupIds: string[]): Promise<WaitTimeResponse> {
    return this.dashboardService.waitTime(this.contextId, groupIds);
  }

  @Get('bettingActivity')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns betting activity widget data',
    type: BettingActivityResponse,
  })
  public bettingActivity(): Promise<BettingActivityResponse> {
    return this.dashboardService.bettingActivity(this.contextId);
  }

  @Get('30daysActiveNewPlayers')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns 30 days active and new players widget data',
    type: ThirtyDaysActiveNewPlayersResponse,
  })
  public thirtyDaysActiveNewPlayers(): Promise<ThirtyDaysActiveNewPlayersResponse> {
    return this.dashboardService.thirtyDaysActiveNewPlayers(this.contextId);
  }

  @Get('topWinnersLosers')
  @SetMetadata('tag', ModuleTags.DASHBOARD)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns 30 days active and new players widget data',
    type: TopWinnersLosersResponse,
  })
  public topWinnersLosers(): Promise<TopWinnersLosersResponse> {
    return this.dashboardService.topWinnersLosers(this.contextId);
  }
}

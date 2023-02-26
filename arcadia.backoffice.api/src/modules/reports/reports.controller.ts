import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  ActivityReportResponse,
  FunnelReportResponse,
  PlayerStatsReportResponse,
  PlayerBlocksReportResponse,
  RetentionReportResponse,
  ReportTypes,
  RevenueReportResponse,
  DisputesReportResponse,
  VouchersReportResponse,
  MachineStatusReportResponse,
  ReportsInfoResponse,
  DisputesReportFilterBy,
  DisputeStatus,
} from 'arcadia-dal';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ReportsService } from './reports.service';
import { ModuleAccessGuard } from '../../guards';
import { ModuleTags } from '../../enums';
import { MainAppInterceptor } from '../../interceptors/app';
import { FunnelReportQueryDto } from './dtos/funnel.report.query.dto';
import {
  VouchersReportQueryDto,
  ActivityReportQueryDto,
  PlayerStatsReportQueryDto,
  RetentionReportQueryDto,
  RevenueReportQueryDto,
  DisputesReportQueryDto,
  MachineStatusReportQueryDto,
  ReportsInfoReportsDto,
  PlayerBlocksReportQueryDto,
} from './dtos';

@ApiTags('report')
@Controller('report')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class ReportsController {
  constructor(
    @Inject(ReportsService) private readonly reportService: ReportsService,
  ) {
  }

  @Get('/:reportType/info')
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns processed reports info', type: ReportsInfoResponse })
  @ApiImplicitParam({ required: true, name: 'reportType', description: 'Filter report by type of report' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  public getReportsInfo(@Param() params: ReportsInfoReportsDto, @Query() filters: any): Promise<ReportsInfoResponse> {
    return this.reportService.getReportsInfo(params.reportType, filters);
  }

  @Get(`/${ReportTypes.ACTIVITY}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns activity report', type: ActivityReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  public getActivityReport(@Query() query: ActivityReportQueryDto): Promise<ActivityReportResponse> {
    return this.reportService.getReport<ActivityReportQueryDto, ActivityReportResponse>(query, ReportTypes.ACTIVITY);
  }

  @Get(`/${ReportTypes.PLAYER_BLOCKS}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns player-blocks report', type: PlayerBlocksReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'playerId', description: 'Filter for reports by players' })
  @ApiImplicitQuery({ required: false, name: 'blockReason', description: 'Filter for reports by reason block' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getPlayerBlocksReport(@Query() query: PlayerBlocksReportQueryDto): Promise<PlayerBlocksReportResponse> {
    return this.reportService.getReport<PlayerBlocksReportQueryDto, PlayerBlocksReportResponse>(query, ReportTypes.PLAYER_BLOCKS);
  }

  @Get(`/${ReportTypes.DISPUTES}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns disputes report', type: DisputesReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({
    required: false,
    name: 'filterByDate',
    description: 'Filter by dispute open or close date',
    enum: DisputesReportFilterBy,
  })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'playerCid', description: 'Filter for reports by players' })
  @ApiImplicitQuery({
    required: false,
    name: 'status',
    description: 'Filter for reports by dispute status',
    enum: DisputeStatus,
  })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getDisputesReport(@Query() query: DisputesReportQueryDto): Promise<DisputesReportResponse> {
    return this.reportService.getReport<DisputesReportQueryDto, DisputesReportResponse>(query, ReportTypes.DISPUTES);
  }

  @Get(`/${ReportTypes.PLAYER_STATS}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns player-stats report', type: PlayerStatsReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'playerId', description: 'Filter for reports by players' })
  @ApiImplicitQuery({ required: false, name: 'sessionId', description: 'Filter for reports by sessions' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getPlayerStatsReport(@Query() query: PlayerStatsReportQueryDto): Promise<PlayerStatsReportResponse> {
    return this.reportService.getReport<PlayerStatsReportQueryDto, PlayerStatsReportResponse>(query, ReportTypes.PLAYER_STATS);
  }

  @Get(`/${ReportTypes.REVENUE}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns revenue report', type: RevenueReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getRevenueReport(@Query() query: RevenueReportQueryDto): Promise<RevenueReportResponse> {
    return this.reportService.getReport<RevenueReportQueryDto, RevenueReportResponse>(query, ReportTypes.REVENUE);
  }

  @Get(`/${ReportTypes.VOUCHERS}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns vouchers report', type: VouchersReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'playerCid', description: 'Filter for reports by player' })
  @ApiImplicitQuery({ required: false, name: 'voucherId', description: 'Filter for reports by voucher' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getVouchersReport(@Query() query: VouchersReportQueryDto): Promise<VouchersReportResponse> {
    return this.reportService.getReport<VouchersReportQueryDto, VouchersReportResponse>(query, ReportTypes.VOUCHERS);
  }

  @Get(`/${ReportTypes.MACHINE_STATUS}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns machine status report', type: MachineStatusReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: false, name: 'status', description: 'Filter for reports by status' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getMachineStatusReport(@Query() query: MachineStatusReportQueryDto): Promise<MachineStatusReportResponse> {
    return this.reportService.getReport<MachineStatusReportQueryDto, MachineStatusReportResponse>(query, ReportTypes.MACHINE_STATUS);
  }

  @Get(`/${ReportTypes.FUNNEL}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns funnel report', type: FunnelReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({
    required: false,
    name: 'newPlayersOnly',
    description: 'Filter for reports by players who played first time',
  })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getFunnelReport(@Query() query: FunnelReportQueryDto): Promise<FunnelReportResponse> {
    return this.reportService.getReport<FunnelReportQueryDto, FunnelReportResponse>(query, ReportTypes.FUNNEL);
  }

  @Get(`/${ReportTypes.RETENTION}`)
  @SetMetadata('tag', ModuleTags.REPORTS)
  @ApiOkResponse({ description: 'Returns retention report', type: RetentionReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getRetentionReport(@Query() query: RetentionReportQueryDto): Promise<RetentionReportResponse> {
    return this.reportService.getReport<RetentionReportQueryDto, RetentionReportResponse>(query, ReportTypes.RETENTION);
  }
}

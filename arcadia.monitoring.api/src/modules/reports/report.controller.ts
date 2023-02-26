import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {
  ActivityReportResponse,
  DisputesReportFilterBy,
  DisputesReportResponse,
  FunnelReportResponse,
  MachineStatusReportResponse,
  PlayerStatsReportResponse,
  PlayerBlocksReportResponse,
  RetentionReportResponse,
  ReportTypes,
  RevenueReportResponse,
  VouchersReportResponse,
  DisputeStatus,
} from 'arcadia-dal';
import { ReportService } from './report.service';
import { RetentionReportQueryDto } from './dtos/retention.report.query.dto';
import {
  ActivityReportQueryDto,
  DisputesReportQueryDto,
  FunnelReportQueryDto,
  PlayerStatsReportQueryDto,
  PlayerBlocksReportQueryDto,
  RevenueReportQueryDto,
  MachineStatusReportQueryDto,
  VouchersReportQueryDto,
} from './dtos';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(
    @Inject(ReportService) private readonly reportService: ReportService,
  ) {
  }

  @Get(`/${ReportTypes.ACTIVITY}`)
  @ApiOkResponse({ description: 'Returns activity report', type: ActivityReportResponse })
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
  public getActivityReport(@Query() query: ActivityReportQueryDto): Promise<ActivityReportResponse> {
    return this.reportService.getActivityReport(query);
  }

  @Get(`/${ReportTypes.DISPUTES}`)
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
  public async getDisputesReport(@Query() query: DisputesReportQueryDto): Promise<DisputesReportResponse> {
    return this.reportService.getDisputesReport(query);
  }

  @Get(`/${ReportTypes.PLAYER_STATS}`)
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
    return this.reportService.getPlayerStatsReport(query);
  }

  @Get(`/${ReportTypes.PLAYER_BLOCKS}`)
  @ApiOkResponse({ description: 'Returns player-blocks report', type: PlayerBlocksReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'playerId', description: 'Filter for reports by players' })
  @ApiImplicitQuery({ required: false, name: 'blockReason', description: 'Filter for reports by reason block' })
  @ApiImplicitQuery({ required: false, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getPlayerBlocksReport(@Query() query: PlayerBlocksReportQueryDto):Promise<PlayerBlocksReportResponse> {
    return this.reportService.getPlayerBlocksReport(query);
  }

  @Get(`/${ReportTypes.REVENUE}`)
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
  public async getRevenueReport(@Query() query: RevenueReportQueryDto): Promise<RevenueReportResponse> {
    return this.reportService.getRevenueReport(query);
  }

  @Get(`/${ReportTypes.VOUCHERS}`)
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
    return this.reportService.getVouchersReport(query);
  }

  @Get(`/${ReportTypes.RETENTION}`)
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
  public async getRetentionReport(@Query() query: RetentionReportQueryDto): Promise<RetentionReportResponse> {
    return this.reportService.getRetentionReport(query);
  }

  @Get(`/${ReportTypes.MACHINE_STATUS}`)
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
  public async getMachineStatusReport(@Query() query: MachineStatusReportQueryDto): Promise<MachineStatusReportResponse> {
    return this.reportService.getMachineStatusReport(query);
  }

  @Get(`/${ReportTypes.FUNNEL}`)
  @ApiOkResponse({ description: 'Returns funnel report', type: FunnelReportResponse })
  @ApiImplicitQuery({ required: true, name: 'startDate', description: 'Filter for reports by start date and time' })
  @ApiImplicitQuery({ required: true, name: 'endDate', description: 'Filter for reports by end date and time' })
  @ApiImplicitQuery({ required: false, name: 'operatorId', description: 'Filter for reports by operators' })
  @ApiImplicitQuery({ required: false, name: 'siteId', description: 'Filter for reports by sites' })
  @ApiImplicitQuery({ required: false, name: 'groupName', description: 'Filter for reports by groups' })
  @ApiImplicitQuery({ required: false, name: 'machineId', description: 'Filter for reports by machines' })
  @ApiImplicitQuery({ required: false, name: 'denomination', description: 'Filter for reports by denomination' })
  @ApiImplicitQuery({ required: false, name: 'newPlayersOnly', description: 'Filter for reports by players who played first time' })
  @ApiImplicitQuery({ required: true, name: 'groupBy', description: 'Grouping option for reports' })
  @ApiImplicitQuery({ required: true, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: true, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: true, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: true, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public async getFunnelReport(@Query() query: FunnelReportQueryDto): Promise<FunnelReportResponse> {
    return this.reportService.getFunnelReport(query);
  }
}

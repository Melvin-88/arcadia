import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Optional, Param,
  Post,
  Query,
  Req,
  Scope,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { MainAppInterceptor } from '../../interceptors/app';
import { VoucherPortalService } from './voucherPortal.service';
import { StatisticsResponse } from './voucherPortal.interface';
import { VoucherResponse, VouchersResponse } from '../vouchers/vouchers.interface';
import { VoucherCreateDto } from './voucherCreate.dto';
import { RevokeVoucherDto } from '../vouchers/vouchers.dto';
import { GroupsService } from '../groups/groups.service';
import { GroupNamesResponse } from '../groups/responses';

@ApiTags('voucherPortal')
@UseGuards(AuthGuard('voucherPortalBearer'))
@ApiBearerAuth()
@Controller({ path: 'voucherPortal', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class VoucherPortalController {
  private readonly contextId: ContextId;

  constructor(
    private readonly voucherPortalService: VoucherPortalService,
    private readonly groupsService: GroupsService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @ApiOkResponse({ description: 'Returns vouchers data', type: VouchersResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for voucher\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for voucher\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'groupName', description: 'Filter for voucher\'s group name', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'playerCid', description: 'Filter for voucher\'s player cid' })
  @ApiImplicitQuery({
    required: false,
    name: 'grantedDateFrom',
    description: 'Filter for voucher\'s start date & time',
  })
  @ApiImplicitQuery({ required: false, name: 'grantedDateTo', description: 'Filter for voucher\'s start date & time' })
  @ApiImplicitQuery({ required: false, name: 'expirationDateFrom', description: 'Filter for voucher\'s rounds count' })
  @ApiImplicitQuery({ required: false, name: 'expirationDateTo', description: 'Filter for voucher\'s rounds count' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getVouchers(@Query() query: any, @Req() req): Promise<VouchersResponse> {
    query.operatorName = req.user.name;
    return this.voucherPortalService.getVouchers(query, this.contextId);
  }

  @Get('/groupNames')
  @ApiOkResponse({ description: 'Returns all group names', type: GroupNamesResponse })
  public getGroupNames(): Promise<GroupNamesResponse> {
    return this.groupsService.getGroupNames();
  }

  @Get('/statistics')
  @ApiOkResponse({ description: 'Returns statistics for upper bar', type: StatisticsResponse })
  public getStatistics(@Req() req): Promise<StatisticsResponse> {
    return this.voucherPortalService.getStatistics(req.user.id, this.contextId);
  }

  @Post('/')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Voucher created', type: [VoucherResponse] })
  public createVoucher(@Body() data: VoucherCreateDto, @Req() req): Promise<VoucherResponse[]> {
    return this.voucherPortalService.createVoucher(data, req.user.id, this.contextId);
  }

  @Delete('/:id')
  @ApiImplicitParam({ name: 'id' })
  @ApiOkResponse({ description: 'Returns updated voucher data', type: VoucherResponse })
  public revokeVoucher(@Param() params: any, @Body() data: RevokeVoucherDto): Promise<VoucherResponse> {
    return this.voucherPortalService.revokeVoucher(params.id, data.reason, this.contextId);
  }
}

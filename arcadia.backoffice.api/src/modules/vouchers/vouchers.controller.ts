import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Optional,
  Param,
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
import { VouchersService } from './vouchers.service';
import { VoucherResponse, VouchersResponse } from './vouchers.interface';
import { RevokeVoucherDto } from './vouchers.dto';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../guards';
import { ModuleTags } from '../../enums';

@ApiTags('vouchers')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'vouchers', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class VouchersController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(VouchersService) private readonly vouchersService: VouchersService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.VOUCHERS)
  @ApiOkResponse({ description: 'Returns vouchers data', type: VouchersResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for voucher\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for voucher\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'groupName', description: 'Filter for voucher\'s group name', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'operatorName', description: 'Filter for voucher\'s operator name', type: [String],
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
  public getVouchers(@Query() query: any): Promise<VouchersResponse> {
    return this.vouchersService.getVouchers(query, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.VOUCHERS)
  @ApiImplicitParam({ name: 'id' })
  @ApiOkResponse({ description: 'Returns updated voucher data', type: VoucherResponse })
  @UseGuards(PasswordRequiredGuard)
  public revokeVoucher(@Param() params: any, @Body() data: RevokeVoucherDto): Promise<VoucherResponse> {
    return this.vouchersService.revokeVoucher(params.id, data.reason, this.contextId);
  }
}

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Optional,
  Param,
  Post,
  Put,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { ContextId, REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { DisputeResponse, DisputesResponse } from './disputes.interface';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, UpdateDisputeDto } from './disputes.dto';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard } from '../../guards';

@ApiTags('disputes')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@Controller({ path: 'disputes', scope: Scope.REQUEST })
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class DisputesController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(DisputesService) private readonly disputesService: DisputesService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.DISPUTES)
  @ApiOkResponse({ description: 'Returns disputes data', type: DisputesResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for dispute\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for dispute\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'operatorName', description: 'Filter for dispute\'s operator name', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'playerCid', description: 'Filter for dispute\'s player cid' })
  @ApiImplicitQuery({ required: false, name: 'rebateFrom', description: 'Filter for dispute\'s rebate' })
  @ApiImplicitQuery({ required: false, name: 'rebateTo', description: 'Filter for dispute\'s rebate' })
  @ApiImplicitQuery({
    required: false,
    name: 'openedAtDateFrom',
    description: 'Filter for dispute\'s opened date and time',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'openedAtDateTo',
    description: 'Filter for dispute\'s opened date and time',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'closedAtDateFrom',
    description: 'Filter for dispute\'s closed date and time',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'closedAtDateTo',
    description: 'Filter for dispute\'s closed date and time',
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public async getDisputes(@Query() query: any): Promise<DisputesResponse> {
    return this.disputesService.getDisputes(query, this.contextId);
  }

  @Get('/rebateCurrencies')
  @SetMetadata('tag', ModuleTags.DISPUTES)
  public getRebateCurrencies(): Promise<string[]> {
    return this.disputesService.getRebateCurrencies(this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.DISPUTES)
  @ApiCreatedResponse({ description: 'Returns created dispute data', type: DisputeResponse })
  public createDispute(@Body() body: CreateDisputeDto): Promise<DisputeResponse> {
    return this.disputesService.createDispute(body, this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.DISPUTES)
  @ApiImplicitParam({ name: 'id', description: 'Identifier of dispute which is needed to update' })
  @ApiOkResponse({ description: 'Returns updated dispute data', type: DisputeResponse })
  public updateDispute(@Param('id') disputeId: number, @Body() body: UpdateDisputeDto): Promise<DisputeResponse> {
    return this.disputesService.updateDispute(disputeId, body, this.contextId);
  }
}

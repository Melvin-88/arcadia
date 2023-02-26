import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Optional,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { PasswordRequiredDto } from '../../dtos/password.required.dto';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../guards';
import { MainAppInterceptor } from '../../interceptors/app';
import { CreateGroupDto, EditGroupDto } from './dtos';
import { GroupsService } from './groups.service';
import {
  DenominatorValuesResponse,
  GroupIdResponse,
  GroupNamesResponse,
  GroupResponse,
  GroupsResponse,
  PrizeGroupsResponse,
} from './responses';

@ApiTags('groups')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'groups', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class GroupsController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(GroupsService) private readonly groupsService: GroupsService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiOkResponse({ description: 'Returns groups data', type: GroupsResponse })
  @ApiImplicitQuery({
    required: false, name: 'id', description: 'Filter for group id', type: [Number],
  })
  @ApiImplicitQuery({ required: false, name: 'name', description: 'Filter for group\'s name' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for group\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'machinesTotal',
    description: 'Filter for group\'s total machines count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'machinesIdle',
    description: 'Filter for group\'s idle machines count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'denominator',
    description: 'Filter for group\'s denominator',
    type: [Number],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'hasJackpot',
    description: 'Filter for group\'s has jackpot status',
    type: [Boolean],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'operators',
    description: 'Filter for group\'s operators status. 1 - true, 0 - false',
    type: [Number],
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({
    required: false,
    name: 'sortBy',
    description: 'Sort by column with provided name',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'sortOrder',
    description: 'Sort order, ascending by default',
  })
  public getGroups(@Query() query: any): Promise<GroupsResponse> {
    return this.groupsService.getGroups(query);
  }

  @Get('/names')
  @SetMetadata('tag', [ModuleTags.GROUPS, ModuleTags.SESSIONS, ModuleTags.MACHINES, ModuleTags.VOUCHERS, ModuleTags.MONITORING])
  @ApiOkResponse({ description: 'Returns all group names', type: GroupNamesResponse })
  public getGroupNames(): Promise<GroupNamesResponse> {
    return this.groupsService.getGroupNames();
  }

  @Get('/denominator-values')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiOkResponse({
    description: 'Returns all unique denominator values',
    type: DenominatorValuesResponse,
  })
  public async getDenominators(): Promise<DenominatorValuesResponse> {
    return this.groupsService.getDenominatorValues();
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  public async editGroup(@Param() params: any, @Body() data: EditGroupDto): Promise<GroupResponse> {
    return this.groupsService.editGroup(params.id, data, this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @UseGuards(PasswordRequiredGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns created groups data',
    type: GroupResponse,
  })
  public createGroup(@Body() data: CreateGroupDto): Promise<GroupResponse> {
    return this.groupsService.createGroup(data, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  public deleteGroup(@Body() data: PasswordRequiredDto, @Param() params: any): Promise<void> {
    return this.groupsService.deleteGroup(params.id, this.contextId);
  }

  @Post('/:id/activate')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated groups data',
    type: GroupResponse,
  })
  public activateGroup(@Body() data: PasswordRequiredDto, @Param() params: any): Promise<GroupResponse> {
    return this.groupsService.activateGroup(params.id, this.contextId);
  }

  @Post('/:id/dry')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated groups data',
    type: GroupIdResponse,
  })
  public dryGroup(@Body() data: PasswordRequiredDto, @Param() params: any): Promise<GroupIdResponse> {
    return this.groupsService.dryGroup(params.id);
  }

  @Post('/:id/shutdown')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(ModuleAccessGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns stopped group id', type: GroupIdResponse })
  public shutdownGroup(@Param('id', ParseIntPipe) groupId: number): Promise<GroupIdResponse> {
    return this.groupsService.shutdownGroup(groupId);
  }

  @Get('/prize-groups')
  @SetMetadata('tag', ModuleTags.GROUPS)
  @ApiOkResponse({ description: 'Returns all unique prize groups', type: PrizeGroupsResponse })
  public getPrizeGroups(): Promise<PrizeGroupsResponse> {
    return this.groupsService.getPrizeGroups();
  }
}

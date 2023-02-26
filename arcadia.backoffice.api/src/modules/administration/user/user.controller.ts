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
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { UserActionsResponse, UserResponse, UsersResponse } from './user.interface';
import { ChangeUserPasswordDto, CreateUserDto, EditUserDto } from './user.dto';
import { ModuleTags } from '../../../enums';
import { MainAppInterceptor } from '../../../interceptors/app';
import { UserService } from './user.service';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../../guards';

@ApiTags('administration')
@Controller({ path: 'administration', scope: Scope.REQUEST })
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class UserController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiOkResponse({ description: 'Returns administration users\' data', type: UsersResponse })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for user\'s status', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for user\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'isAdmin', description: 'Filter for user\'s admin status', type: [Boolean],
  })
  @ApiImplicitQuery({ required: false, name: 'userName', description: 'Filter for user\'s username' })
  @ApiImplicitQuery({ required: false, name: 'lastAccessDateFrom', description: 'Filter for user\'s last access date' })
  @ApiImplicitQuery({ required: false, name: 'lastAccessDateTo', description: 'Filter for user\'s last access date' })
  @ApiImplicitQuery({ required: false, name: 'lastAccessIp', description: 'Filter for user\'s current value' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getUsers(@Query() query: any): Promise<UsersResponse> {
    return this.userService.getUsers(query, this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @UseGuards(PasswordRequiredGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns created administration users\' data', type: UserResponse })
  public createUser(@Body() data: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(data, this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  @ApiOkResponse({ description: 'Returns updated administration users\' data', type: UserResponse })
  public editUser(@Param() params: any, @Body() data: EditUserDto): Promise<UserResponse> {
    return this.userService.editUser(params.id, data, this.contextId);
  }

  @Post('/:id/changePassword')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  @SetMetadata('passwordField', 'currentUsersPassword')
  public changeUserPassword(@Param() params: any, @Body() data: ChangeUserPasswordDto): Promise<void> {
    return this.userService.changeUserPassword(params.id, data, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(PasswordRequiredGuard)
  public removeUser(@Param() params: any): Promise<void> {
    return this.userService.removeUser(params.id, this.contextId);
  }

  @Post('/:id/enable')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated administration users\' data', type: UserResponse })
  @UseGuards(PasswordRequiredGuard)
  public enableUser(@Param() params: any): Promise<UserResponse> {
    return this.userService.enableUser(params.id, this.contextId);
  }

  @Post('/:id/disable')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated administration users\' data', type: UserResponse })
  @UseGuards(PasswordRequiredGuard)
  public disableUser(@Param() params: any): Promise<UserResponse> {
    return this.userService.disableUser(params.id, this.contextId);
  }

  @Get('/:id/actions')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitParam({ name: 'id' })
  @ApiOkResponse({ description: 'Returns administration user\'s actions data', type: UserActionsResponse })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public async userActions(@Param() params: any, @Query() query: any): Promise<UserActionsResponse> {
    return this.userService.userActions(params.id, query, this.contextId);
  }
}

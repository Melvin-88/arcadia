import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'arcadia-dal';
import { MainAppInterceptor } from '../../interceptors/app';
import { AuthService } from './auth.service';
import { LoginResponse, BoModulesResponse, LoginVoucherPortalResponse } from './auth.interface';
import { LoginDto } from './dtos/auth.dto';
import { LoginVoucherPortalDto } from './dtos/authVoucherPortal.dto';
import { User } from '../../decorators/user';
import { USER_NOT_FOUND } from '../../messages/messages';

@ApiTags('auth')
@Controller({ path: 'auth' })
@UseInterceptors(MainAppInterceptor)
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @ApiOkResponse({ description: 'Returns access token and list of ids of permitted modules', type: LoginResponse })
  @Post('login')
  public login(@Body() data: LoginDto): Promise<LoginResponse> {
    return this.authService.login(data.email, data.password);
  }

  @UseGuards(AuthGuard('localVoucherPortal'))
  @ApiOkResponse({ description: 'Returns access token for voucher portal', type: LoginVoucherPortalResponse })
  @Post('loginVoucherPortal')
  public loginVoucherPortal(@Body() data: LoginVoucherPortalDto): Promise<LoginVoucherPortalResponse> {
    return this.authService.loginVoucherPortal(data.username, data.password);
  }

  @UseGuards(AuthGuard('bearer'))
  @Get('/bo-modules')
  @ApiOkResponse({ description: 'Returns all permissions with ids and description', type: BoModulesResponse })
  public getAllBoModules(): Promise<BoModulesResponse> {
    return this.authService.getAllBoModules();
  }

  @UseGuards(AuthGuard('bearer'))
  @Get('/permitted-modules')
  @ApiOkResponse({ description: 'Returns current user\'s array of permitted modules ids' })
  public getPermissionsByUserId(@User() user: UserEntity): number[] {
    if (!user) throw new BadRequestException(USER_NOT_FOUND.en);
    return user.permittedModules.map(module => module.id);
  }
}

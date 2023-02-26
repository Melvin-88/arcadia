import {
  Body, Controller, Get, Headers, Post, Query, UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CORRELATION_ID_HEADER } from '../../constants/logging.constants';
import { MainAppInterceptor } from '../../interceptors/app';
import { JwtTokenDto } from '../dto/jwt.token.dto';
import { AuthService } from './auth.service';
import { AuthPlayerDto } from './dto/auth.player.dto';
import { AuthResponseDto } from './dto/auth.player.response.dto';
import { CreateUrlDto } from './dto/create.url.dto';
import { LobbyChangeBetDto } from './dto/lobby.change.bet.dto';
import { ReconnectDto } from './dto/reconnect.dto';
import { ReconnectVerifyResponseDto } from './dto/reconnect.verify.response.dto';
import { TokenVerifyRespDto } from './dto/token.verify.resp.dto';
import { VerifyAuthTokenDto } from './dto/verify.auth.token.dto';
import { VideoStreamAuthDto } from './dto/video.stream.auth.dto';

@ApiTags('Player Auth')
@Controller('v1/auth')
@UseInterceptors(MainAppInterceptor)
@ApiBadRequestResponse({ description: 'Bad request' })
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiCreatedResponse({ description: 'Success', type: AuthResponseDto })
  @ApiNotAcceptableResponse({ description: 'Not acceptable' })
  @Post()
  public createValidationToken(@Body() data: AuthPlayerDto,
                               @Headers(CORRELATION_ID_HEADER) corrId: string): Promise<AuthResponseDto> {
    return this.authService.authPlayer(corrId, data);
  }

  @ApiCreatedResponse({ description: 'Success', type: TokenVerifyRespDto })
  @Post('/verify')
  public exchangeValidationToken(@Body() data: VerifyAuthTokenDto): Promise<TokenVerifyRespDto> {
    return this.authService.exchangeValidationToken(data.token, data.groupId, data.footprint);
  }

  @ApiCreatedResponse({ description: 'Success', type: ReconnectVerifyResponseDto })
  @Post('/reconnect')
  public reconnect(@Body() data: ReconnectDto): Promise<ReconnectVerifyResponseDto> {
    return this.authService.verifyReconnect(data.sessionId, data.footprint);
  }

  @ApiOkResponse({ description: 'Success', type: LobbyChangeBetDto })
  @Get('/lobby')
  public lobby(@Query() data: JwtTokenDto): Promise<LobbyChangeBetDto> {
    return this.authService.handleLobby(data.token);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @Post('/videoStreamAuth')
  public videoStreamAuth(@Body() data: VideoStreamAuthDto): Promise<void> {
    return this.authService.videoStreamAuth(data.token);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @Post('/launchUrl/create')
  public async createLaunchUrl(@Body() data: CreateUrlDto): Promise<any> {
    const url = await this.authService.createUrl(data);
    return { launchUrl: url, errorCode: 0 };
  }
}

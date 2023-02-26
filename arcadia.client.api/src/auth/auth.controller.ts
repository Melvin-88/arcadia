import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody, ApiCreatedResponse, ApiOkResponse, ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { isIP } from 'net';
import * as requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import { StreamAuth, UserLogin, UserLoginResponse } from './auth';
import { AuthService } from './auth.service';
import { JwtTokenDto } from './dto/jwt.token.dto';
import { LobbyChangeBetDto } from './dto/lobby.change.bet.dto';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  // eslint-disable-next-line no-empty-function
  constructor(private readonly authService: AuthService) {
  }

  @ApiBody({ type: UserLogin, description: 'Auth request' })
  @ApiResponse({ type: UserLoginResponse, description: 'Auth response' })
  @Post()
  public async clientLogin(@Req() req: Request, @Body() data: UserLogin): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`Logging in player: ${JSON.stringify(data)}, correlation=${correlationId}`);
    let playerIp = requestIp.getClientIp(req) || '0.0.0.0';
    if (isIP(playerIp) === 0) {
      playerIp = '0.0.0.0';
    }
    const userAgent = req.headers['user-agent'] || '';
    try {
      return await this.authService.clientLogin(correlationId, playerIp, userAgent, data);
    } catch (reason) {
      this.logger.error(reason);
      throw new HttpException(reason.response?.data?.data || { message: 'Fatal' },
        reason.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({ type: StreamAuth, description: 'Stream auth token data' })
  @ApiCreatedResponse({ description: 'Token is valid' })
  @Post('/videoStreamAuth')
  public async videoStreamAuth(@Body() data: StreamAuth): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`videoStreamAuth: ${JSON.stringify(data)}, correlation=${correlationId}`);
    try {
      return await this.authService.videoStreamAuth(correlationId, data.token);
    } catch (reason) {
      throw new HttpException((reason.response.data && reason.response.data.data)
        || { message: 'Fatal' }, reason.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiCreatedResponse({ description: 'BlueRibbon anonymous auth' })
  @Post('/loginAnonymous')
  public async loginAnonymous(@Body() data: JwtTokenDto): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`loginAnonymous, data=${JSON.stringify(data)}, correlationId=${correlationId}`);
    try {
      return await this.authService.loginAnonymous(data.token, correlationId);
    } catch (reason) {
      throw new HttpException((reason.response.data && reason.response.data.data)
        || { message: 'Fatal' }, reason.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiCreatedResponse({ description: 'BlueRibbon player auth' })
  @Post('/loginPlayer')
  public async loginPlayer(@Body() data: JwtTokenDto): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`loginPlayer, data=${JSON.stringify(data)}, correlationId=${correlationId}`);
    try {
      return await this.authService.loginPlayer(data.token, correlationId);
    } catch (reason) {
      throw new HttpException((reason.response.data && reason.response.data.data)
        || { message: 'Fatal' }, reason.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOkResponse({ description: 'Lobby polling', type: LobbyChangeBetDto })
  @Get('/lobby')
  public async getLobby(@Query() data: JwtTokenDto): Promise<LobbyChangeBetDto> {
    const correlationId = uuidv4();
    this.logger.log(`lobby, data=${JSON.stringify(data)}, correlationId=${correlationId}`);
    try {
      return await this.authService.getLobby(data.token, correlationId);
    } catch (reason) {
      throw new HttpException((reason.response.data && reason.response.data.data)
        || { message: 'Fatal' }, reason.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

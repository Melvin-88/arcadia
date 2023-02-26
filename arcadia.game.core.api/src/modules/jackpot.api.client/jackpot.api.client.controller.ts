import {
  Body,
  Controller,
  Headers,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { MainAppInterceptor } from '../../interceptors/app';
import { JwtTokenDto } from '../dto/jwt.token.dto';
import { JackpotContributeEvent } from '../event.bus/dto/jackpot.contribute.event';
import { AppLogger } from '../logger/logger.service';
import { Route } from '../rmq.server/route';
import { rpcValidationExceptionFactory } from '../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../rpc.exception.handler/filters/rpc.main.exception.filter';
import { CancelContributionDto, JackpotWinDto } from './dto';
import { JackpotApiClientService } from './jackpot.api.client.service';

@Controller('v1/jackpots')
@UseInterceptors(MainAppInterceptor)
export class JackpotApiClientController {
  constructor(private readonly logger: AppLogger,
              private readonly jackpotApiClientService: JackpotApiClientService,
  ) {
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('win')
  @ApiOkResponse({ description: 'Jackpot win callback received OK' })
  public async postJackpotWin(@Body() data: JackpotWinDto): Promise<any> {
    return this.jackpotApiClientService.jackpotWinCallback(data);
  }

  @Post('loginAnonymous')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiCreatedResponse({ description: 'Login OK' })
  public async loginAnonymous(@Body() data: JwtTokenDto, @Headers('correlation')corrId: string,
  ): Promise<any> {
    this.logger.log(`BlueRibbon: Login anonymous, data=${JSON.stringify(data)}, correlationId=${corrId || 'none'}`);
    return this.jackpotApiClientService.loginAnonymous(data.token);
  }

  @Post('loginPlayer')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiCreatedResponse({ description: 'Login OK' })
  public async loginPlayer(@Body() data: JwtTokenDto, @Headers('correlation')corrId: string,
  ): Promise<any> {
    this.logger.log(`BlueRibbon: Login player, data=${JSON.stringify(data)}, correlationId=${corrId || 'none'}`);
    return this.jackpotApiClientService.loginPlayer(data.token);
  }

  @UseFilters(RpcMainExceptionFilter)
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: rpcValidationExceptionFactory,
  }))
  @MessagePattern(`${Route.EVENT_BUS}.jackpotcontribute`)
  public async contributeJackpot(@Payload() data: JackpotContributeEvent): Promise<void> {
    await this.jackpotApiClientService.contribute(data);
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('cancelContribution')
  @ApiOkResponse({ description: 'Jackpot contribution refunded' })
  public async cancelContribution(@Body() data: CancelContributionDto): Promise<any> {
    return this.jackpotApiClientService.cancelContribution(data.cancelDetails);
  }
}

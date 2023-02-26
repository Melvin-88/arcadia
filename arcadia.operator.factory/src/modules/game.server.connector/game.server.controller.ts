import {
  Body, Controller, Param, Post, UseFilters, UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { APIExceptionFilter } from '../../filters/exception.filter';
import { MainAppInterceptor } from '../../interceptors/loggerInterceptor';
import { OperatorFactory } from '../adapter.factory/operator.factory';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResponse } from './dto/auth.response.dto';
import { BalanceResponse } from './dto/balance.response.dto';
import { BalanceRequestDto } from './dto/balanceRequestDto';
import { BetResponse } from './dto/bet.response.dto';
import { BetRequestDto } from './dto/betRequestDto';

@ApiTags('Operators')
@Controller('v1/operator')
@ApiBadRequestResponse({ description: 'Bad request', type: Object })
@ApiInternalServerErrorResponse({ description: 'Critical error', type: Object })
@UseInterceptors(MainAppInterceptor)
@UseFilters(APIExceptionFilter)
export class GameServerController {
  constructor(private readonly operatorFactory: OperatorFactory) {
  }

  @ApiCreatedResponse({ description: 'Success', type: AuthResponse })
  @Post(':id/auth')
  public authenticate(
    @Param('id')operatorId: string, @Body() data: AuthRequestDto,
  ): Promise<AuthResponse> {
    return this.operatorFactory.getOperatorAdapter(operatorId).authenticate(data);
  }

  @ApiCreatedResponse({ description: 'Success', type: BalanceResponse })
  @Post(':id/balance')
  public getBalance(
    @Param('id')operatorId: string, @Body() data: BalanceRequestDto,
  ): Promise<BalanceResponse> {
    return this.operatorFactory.getOperatorAdapter(operatorId).balance(data);
  }

  @ApiCreatedResponse({ description: 'Success', type: BetResponse })
  @Post(':id/bet')
  public bet(
    @Param('id')operatorId: string, @Body()data: BetRequestDto,
  ): Promise<BetResponse> {
    return this.operatorFactory.getOperatorAdapter(operatorId).bet(data);
  }

  @ApiCreatedResponse({ description: 'Success', type: BalanceResponse })
  @Post(':id/cancelBet')
  public cancelBet(
    @Param('id')operatorId: string, @Body()data: BetRequestDto,
  ): Promise<BalanceResponse> {
    return this.operatorFactory.getOperatorAdapter(operatorId).cancelBet(data);
  }

  @ApiCreatedResponse({ description: 'Success', type: BalanceResponse })
  @Post(':id/payout')
  public payout(
    @Param('id')operatorId: string, @Body()data: BetRequestDto,
  ): Promise<BalanceResponse> {
    return this.operatorFactory.getOperatorAdapter(operatorId).payout(data);
  }
}

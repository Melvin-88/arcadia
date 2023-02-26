import { AuthRequestDto } from '../game.server.connector/dto/auth.request.dto';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { BalanceResponse } from '../game.server.connector/dto/balance.response.dto';
import { BalanceRequestDto } from '../game.server.connector/dto/balanceRequestDto';
import { BetResponse } from '../game.server.connector/dto/bet.response.dto';
import { BetRequestDto } from '../game.server.connector/dto/betRequestDto';
import { OperatorAdapter } from './operator.interface';

export abstract class BaseOperatorAdapter<CONFIG extends Record<string, any>> implements OperatorAdapter {
  protected readonly config: CONFIG;

  protected constructor(config: CONFIG) {
    this.config = config;
  }

  abstract getID(): string;

  abstract authenticate(data: AuthRequestDto): Promise<AuthResponse>;

  abstract balance(data: BalanceRequestDto): Promise<BalanceResponse>;

  abstract bet(data: BetRequestDto): Promise<BetResponse>;

  abstract cancelBet(data: BetRequestDto): Promise<BalanceResponse>;

  abstract payout(data: BetRequestDto): Promise<BalanceResponse>;
}

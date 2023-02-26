import { AuthRequestDto } from '../game.server.connector/dto/auth.request.dto';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { BalanceResponse } from '../game.server.connector/dto/balance.response.dto';
import { BalanceRequestDto } from '../game.server.connector/dto/balanceRequestDto';
import { BetResponse } from '../game.server.connector/dto/bet.response.dto';
import { BetRequestDto } from '../game.server.connector/dto/betRequestDto';

export interface OperatorAdapter {

  getID(): string;

  authenticate(data: AuthRequestDto): Promise<AuthResponse>;

  balance(data: BalanceRequestDto): Promise<BalanceResponse>;

  bet(data: BetRequestDto): Promise<BetResponse>;

  cancelBet(data: BetRequestDto): Promise<BalanceResponse>;

  payout(data: BetRequestDto): Promise<BalanceResponse>;
}

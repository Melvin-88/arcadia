import { ApiPropertyOptional } from '@nestjs/swagger';
import { BalanceResponse } from './balance.response.dto';

export class BetResponse extends BalanceResponse {
  @ApiPropertyOptional()
  transactionId?: string
}

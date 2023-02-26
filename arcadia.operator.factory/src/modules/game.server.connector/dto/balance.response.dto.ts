import { ApiResponseProperty } from '@nestjs/swagger';

export class BalanceResponse {
  @ApiResponseProperty()
  balance: number;

  @ApiResponseProperty()
  timestamp: Date;
}

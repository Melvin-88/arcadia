import { Injectable } from '@nestjs/common';
import { Mapper } from '../common/mapper';
import { BalanceResponse } from '../game.server.connector/dto/balance.response.dto';
import { parseTimestamp } from '../spinomenal/date.to.timestamp.mapping';

@Injectable()
export class BalanceResponseMapper extends Mapper<Record<string, any>, BalanceResponse> {
  map(data: Record<string, any>): BalanceResponse {
    const { Balance, TimeStamp } = data;
    return {
      balance: Balance,
      timestamp: TimeStamp ? parseTimestamp(TimeStamp) : new Date(),
    };
  }
}

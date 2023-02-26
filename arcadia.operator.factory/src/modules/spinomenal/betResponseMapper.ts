import { Injectable } from '@nestjs/common';
import { Mapper } from '../common/mapper';
import { BetResponse } from '../game.server.connector/dto/bet.response.dto';
import { parseTimestamp } from './date.to.timestamp.mapping';

@Injectable()
export class BetResponseMapper extends Mapper<Record<string, any>, BetResponse> {
  map(data: Record<string, any>): BetResponse {
    const { Balance, TimeStamp, ExtTransactionId } = data;
    return {
      balance: Balance,
      timestamp: TimeStamp ? parseTimestamp(TimeStamp) : new Date(),
      transactionId: ExtTransactionId,
    };
  }
}

import { QueueBalanceDto } from '../dto/queueBalanceDto';
import { CoreMessage } from './enum/core.message.type';

export interface CoreClientCoreMessage {
  type: CoreMessage,
  sessionId?: number,
  queueChangeOffers?: QueueBalanceDto[],
  correlationId?: string,
  serial?: string,
  ids?: number[]
}

import { CoreMessage } from './enum/core.message.type';

export interface CoreClientCoreMessage {
  type: CoreMessage;
  sessionId?: number;
  queueChangeOffers?: string[];
}
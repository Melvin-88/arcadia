import { SessionStatus } from './session';

export interface IQueuePlayer {
  status: SessionStatus;
  queueToken: string;
  stacks: number;
}

export type IQueuePlayers = Array<IQueuePlayer>;

export interface IQueue {
  queue: IQueuePlayers;
  viewers: number;
}

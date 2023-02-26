import { SessionStatus } from 'arcadia-dal';

export class QueueItemDto {
  queueToken: string;
  stacks: number;
  status: SessionStatus
}

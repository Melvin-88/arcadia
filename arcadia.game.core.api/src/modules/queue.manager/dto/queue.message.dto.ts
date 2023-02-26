import { QueueItemDto } from './queue.item.dto';

export class QueueMessageDto {
  queue: QueueItemDto[];
  viewers: number;
}

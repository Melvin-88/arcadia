import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { BaseEvent } from './base.event';

export class QueueUpdatesEvent extends BaseEvent {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  queueId: number;
}
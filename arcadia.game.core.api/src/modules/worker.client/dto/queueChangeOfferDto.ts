import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { SessionAwareDto } from '../../dto/session.aware.dto';

export class QueueChangeOfferDto extends SessionAwareDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  toQueueId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  position: number;
}

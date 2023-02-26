import { IsEnum } from 'class-validator';
import { SessionAwareDto } from '../../dto/session.aware.dto';
import { BusEventType } from '../bus.event.type';

export class BaseEvent extends SessionAwareDto {
  @IsEnum(BusEventType)
  type: BusEventType;
}
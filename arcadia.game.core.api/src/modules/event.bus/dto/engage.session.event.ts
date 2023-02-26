import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseEvent } from './base.event';

export class EngageSessionEvent extends BaseEvent {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  machineId: number;

  @Transform(({ value }) => {
    if (typeof value === 'undefined') {
      return undefined;
    }
    return parseInt(value, 10);
  })
  @IsOptional()
  @IsInt()
  reBuySessionId?: number;
}

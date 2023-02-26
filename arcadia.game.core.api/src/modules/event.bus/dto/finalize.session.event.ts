import { IsBoolean, IsOptional, Length } from 'class-validator';
import { BaseEvent } from './base.event';

export class FinalizeSessionEvent extends BaseEvent {
  @IsOptional()
  @IsBoolean()
  terminate?: boolean;

  @IsOptional()
  @Length(1, 256)
  reason?: string;
}

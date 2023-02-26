import { IsArray, IsInt, IsOptional } from 'class-validator';
import { BaseEvent } from './base.event';

export class ChangeQueueEvent extends BaseEvent {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ignoreMachines?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ignoreGroups?: number[];
}
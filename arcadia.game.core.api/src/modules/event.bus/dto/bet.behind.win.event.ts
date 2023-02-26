import { ChipEntity, ChipTypeEntity } from 'arcadia-dal';
import { IsDefined } from 'class-validator';
import { BaseEvent } from './base.event';

export class BetBehindWinEvent extends BaseEvent {
  @IsDefined()
  chip: ChipEntity;

  @IsDefined()
  chipType: ChipTypeEntity;
}
import {
  GroupEntity,
  MachineEntity,
  OperatorEntity,
  PlayerEntity,
  RoundEntity,
  SessionEntity,
} from 'arcadia-dal';
import { IsDefined } from 'class-validator';
import { BaseEvent } from './base.event';

export class JackpotContributeEvent extends BaseEvent {
  @IsDefined()
  session: SessionEntity

  @IsDefined()
  operator: OperatorEntity;

  @IsDefined()
  group: GroupEntity;

  @IsDefined()
  player: PlayerEntity;

  @IsDefined()
  round: RoundEntity;

  @IsDefined()
  machine: MachineEntity;
}
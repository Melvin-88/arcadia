import {
  GroupEntity,
  MachineEntity,
  OperatorEntity,
  PlayerEntity,
  QueueEntity,
  SessionEntity,
  VoucherEntity,
} from 'arcadia-dal';
import { v4 as uuidv4 } from 'uuid';

export class RoundContext {
  constructor(public readonly session: SessionEntity,
              public readonly queue: QueueEntity,
              public readonly machine: MachineEntity,
              public readonly player: PlayerEntity,
              public readonly group: GroupEntity,
              public readonly operator: OperatorEntity,
              public readonly isAutoplayRound: boolean,
              public readonly voucher?: VoucherEntity,
              public readonly correlationId: string = uuidv4(),
  ) {
  }
}

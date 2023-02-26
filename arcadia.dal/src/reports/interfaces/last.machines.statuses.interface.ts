import { MachineStatus } from '../../enums';

export class LastMachinesStatusesInterface {
  status: MachineStatus;
  timestamp: Date;
  info?: {
    machine: number;
    status: MachineStatus;
    operator: number;
    group: number;
    denominator: number;
    site: number;
    day: string;
  }
}

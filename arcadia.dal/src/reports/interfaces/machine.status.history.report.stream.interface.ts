/* eslint-disable camelcase */
import { MachineStatus } from '../../enums';

export class MachineStatusHistoryReportStreamInterface {
  id: number;
  machine: number;
  status: MachineStatus;
  operator: number;
  group: number;
  denominator: number;
  site: number;
  day: string;
  timestamp: Date;
}

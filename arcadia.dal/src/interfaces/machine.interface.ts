import { MachinePowerLine } from '../enums';
import { Configuration } from '../types';

export interface MachineInterface {
  id: number;
  status: string;
  queueStatus: string;
  name: string;
  groupName: string;
  siteName: string;
  serial: string;
  cameraID: string;
  controllerIP: string;
  location: string;
  lastDiagnosticDate: Date;
  statusUpdateDate: Date;
  configuration: Configuration;
  viewers: number;
  inQueue: number;
  uptime: number;
  isDeleted: boolean;
  powerLine: MachinePowerLine;
}

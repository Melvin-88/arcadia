import { AlertSeverity, AlertType } from 'arcadia-dal';
import { EventSource, EventType, MonitoringWorkerMessage } from './enum';

export interface OutOfSessionEventLogData {
  source?: EventSource;
  eventType?: EventType;
  params: Record<string, any>;
}

export interface Alert {
  alertType: AlertType;
  source: string;
  machineId?: number;
  machineSerial?: string;
  machineName?: string;
  severity: AlertSeverity;
  description: string;
  additionalInformation: Record<string, any>;
}

export interface EventParams {
  sessionId?: number;
  machineId?: number;
  operatorId?: number;
  machineSerial: string;
  playerCid?: string;
  status?: string;
  direction?: string;
  settings?: Record<string, any>;
  dir?: string;
  angle?: number;
  remainingCoins?: number;
  coins?: number;
  rfid?: string;
  type?: string;
  value?: number;
  groupId?: number;
  videoUrl?: string;
  round?: number;
  sum?: number;
  transactionId?: string;
  position?: number;
  balance?: number;
  stacks?: number;
  reason?: string;
  purpose?: string;
  response?: string;
  currency?: string;
  orientation?: string;
  decision?: string;
}

export interface EventLogData {
  source?: EventSource;
  eventType?: EventType;
  params: EventParams;
}

export interface CoreToMonitoringWorkerMessage {
  type: MonitoringWorkerMessage;
  source: EventSource;
  eventType: EventType;
  params: EventParams;
}

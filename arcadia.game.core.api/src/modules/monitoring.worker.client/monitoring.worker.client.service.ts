import { Injectable, OnModuleInit } from '@nestjs/common';
import { CORE_TO_MONITORING_WORKER_QUEUE } from '../../constants/rabbit.constants';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { MonitoringWorkerMessage } from './enum';
import {
  Alert,
  CoreToMonitoringWorkerMessage,
  EventLogData,
  OutOfSessionEventLogData,
} from './monitoring.worker.interface';

@Injectable()
export class MonitoringWorkerClientService implements OnModuleInit {
  private server: ServerRMQ;

  public onModuleInit(): void {
    this.server = ServerRMQ.getInstance();
  }

  public sendWorkerMessage(message: CoreToMonitoringWorkerMessage): void {
    this.server.sendMessage(message, CORE_TO_MONITORING_WORKER_QUEUE);
  }

  public sendEventLogMessage(eventLogData: EventLogData): void {
    const msg: CoreToMonitoringWorkerMessage = {
      type: MonitoringWorkerMessage.EVENT_LOG,
      source: eventLogData.source,
      eventType: eventLogData.eventType,
      params: {
        ...eventLogData.params,
      },
    };

    this.sendWorkerMessage(msg);
  }

  public sendOutOfSessionEventLogMessage(machineSerial: string, eventLogData: OutOfSessionEventLogData): void {
    const msg: CoreToMonitoringWorkerMessage = {
      type: MonitoringWorkerMessage.EVENT_LOG,
      source: eventLogData.source,
      eventType: eventLogData.eventType,
      params: {
        machineSerial,
        ...eventLogData.params,
      },
    };

    this.sendWorkerMessage(msg);
  }

  public sendAlertMessage(alert: Alert): void {
    this.onModuleInit();
    this.server.sendMessage({
      ...alert,
      type: MonitoringWorkerMessage.CREATE_ALERT,
    }, CORE_TO_MONITORING_WORKER_QUEUE);
  }
}

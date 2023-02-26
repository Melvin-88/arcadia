import { Injectable } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfigService } from '../config/config.service';
import { EventLogData } from './types/monitoring.worker.message.types';
import { MonitoringWorkerMessageType } from './enum/message.type';

@Injectable()
export class RabbitmqConnectorService {
    private monitoringWorkerChannel: amqp.ChannelWrapper;
    private monitoringWorkerQueue: string;

    constructor(
      config: ConfigService,
    ) {
      const connection = amqp.connect(config.getRabbitMQConfig());
      this.monitoringWorkerQueue = config.get(['core', 'CORE_TO_MONITORING_WORKER_QUEUE']) as string || 'coreToMonitoringWorkerQueue';
      this.monitoringWorkerChannel = connection.createChannel({
        json: true,
        setup(channel) {
          return channel.assertQueue(this.monitoringWorkerQueue, { durable: true });
        },
      });
    }

    public async sendMonitoringWorkerMessage(msg: Record<string, any>): Promise<void> {
      return this.monitoringWorkerChannel.sendToQueue(this.monitoringWorkerQueue, msg);
    }

    public sendEventLogMessage(eventLogData: EventLogData): Promise<void> {
      const msg = {
        type: MonitoringWorkerMessageType.EVENT_LOG,
        source: eventLogData.source,
        eventType: eventLogData.eventType,
        params: {
          ...eventLogData.params,
        },
      };

      return this.sendMonitoringWorkerMessage(msg);
    }
}
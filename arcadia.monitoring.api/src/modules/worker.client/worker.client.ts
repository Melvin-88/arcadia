import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ReportMessageDataInterface } from 'arcadia-dal';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfigService } from '../config/config.service';
import { CORE_TO_MONITORING_WORKER_QUEUE } from '../../constants/rabbit.constants';

@Injectable()
export class WorkerClient implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger: Logger = new Logger(WorkerClient.name);

  onModuleInit(): any {
    const urls: string[] = ConfigService.getRabbitMQConfig();
    const connection = amqp.connect(urls);
    this.channelWrapper = connection.createChannel({
      json: true,
      setup: channel => channel.assertQueue(CORE_TO_MONITORING_WORKER_QUEUE, { durable: true }),
    });
  }

  sendMessage(type: string, data: ReportMessageDataInterface) {
    this.channelWrapper.sendToQueue(
      CORE_TO_MONITORING_WORKER_QUEUE, {
        type,
        data,
      })
      .catch(e => this.logger.error(e));
  }
}

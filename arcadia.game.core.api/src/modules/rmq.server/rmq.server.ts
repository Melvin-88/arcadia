/* eslint-disable max-lines */
import { isString } from '@nestjs/common/utils/shared.utils';
import {
  CustomTransportStrategy,
  OutgoingResponse,
  RmqContext,
  RmqOptions,
  Server,
} from '@nestjs/microservices';
import {
  CONNECT_EVENT,
  DISCONNECT_EVENT,
  DISCONNECTED_RMQ_MESSAGE,
  NO_MESSAGE_HANDLER,
  RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
  RQM_DEFAULT_NOACK,
  RQM_DEFAULT_PREFETCH_COUNT,
  RQM_DEFAULT_QUEUE_OPTIONS,
} from '@nestjs/microservices/constants';
import { Channel, Message } from 'amqplib';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  PLAYER_TO_CORE_QUEUE,
  ROBOT_TO_CORE_QUEUE,
  TO_QUEUE,
  WORKER_TO_CORE_QUEUE,
} from '../../constants/rabbit.constants';
import { ConfigService } from '../config/config.service';
import { EVENT_BUS_QUEUE } from '../event.bus/event.bus.constants';
import { AppLogger } from '../logger/logger.service';
import { Route } from './route';

let rqmPackage: any = {};

export class ServerRMQ extends Server implements CustomTransportStrategy {
  private server: any = null;
  private channelWrapper: any = null;
  private channel: Channel = null;
  private readonly urls: string[] = [];
  private readonly queue: Set<string> = new Set();
  private readonly prefetchCount: number;
  private readonly queueOptions: any;
  private readonly isGlobalPrefetchCount: boolean;
  protected readonly logger: AppLogger;
  private static instance: ServerRMQ;

  constructor(private readonly options: RmqOptions['options'], logger: AppLogger) {
    super();

    this.logger = logger;

    this.urls = ConfigService.getRabbitMQConfig();

    this.prefetchCount = this.getOptionsProp(this.options, 'prefetchCount')
      || RQM_DEFAULT_PREFETCH_COUNT;
    this.isGlobalPrefetchCount = this.getOptionsProp(this.options, 'isGlobalPrefetchCount')
      || RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
    this.queueOptions = this.getOptionsProp(this.options, 'queueOptions')
      || RQM_DEFAULT_QUEUE_OPTIONS;

    // eslint-disable-next-line global-require
    this.loadPackage('amqplib', ServerRMQ.name, () => require('amqplib'));
    rqmPackage = this.loadPackage(
      'amqp-connection-manager',
      ServerRMQ.name,
      // eslint-disable-next-line global-require
      () => require('amqp-connection-manager'),
    );

    this.initializeSerializer(options);
    this.initializeDeserializer();
  }

  public initializeDeserializer(): any {
    this.deserializer = {
      deserialize: rawMessage => {
        const data = JSON.parse(rawMessage.content.toString());
        let pattern: string;
        switch (rawMessage.fields.routingKey) {
          case PLAYER_TO_CORE_QUEUE:
            pattern = `${Route.PLAYER}.${data.type.toLowerCase()}`;
            break;
          case WORKER_TO_CORE_QUEUE:
            pattern = `${Route.WORKER}.${data.type.toLowerCase()}`;
            break;
          case EVENT_BUS_QUEUE:
            pattern = `${Route.EVENT_BUS}.${data.type.toLowerCase()}`;
            break;
          default:
            pattern = `${Route.ROBOT}.${data.type.toLowerCase()}`;
        }
        return { pattern, data };
      },
    };
  }

  public static getQueueName(constant: string, serial: string): string {
    return constant.replace('{serial}', serial);
  }

  public static getConnectors(
    serial: string,
  ): { publisher: string; subscriber: string } {
    return {
      publisher: ROBOT_TO_CORE_QUEUE,
      subscriber: this.getQueueName(TO_QUEUE, serial),
    };
  }

  static getInstance(): ServerRMQ {
    return ServerRMQ.instance;
  }

  public async listen(callback: () => any): Promise<void> {
    await this.start();
    ServerRMQ.instance = this;
    callback();
  }

  public close(): void {
    this.channelWrapper && this.channelWrapper.close();
    this.server && this.server.close();
  }

  public async start(): Promise<void> {
    try {
      this.server = await this.createClient();
      this.server.on(DISCONNECT_EVENT, e => {
        this.logger.error(DISCONNECTED_RMQ_MESSAGE, e.message);
      });

      await new Promise((resolve, reject) => {
        this.server.once(DISCONNECT_EVENT, e => {
          reject(e);
        });

        this.server.on(CONNECT_EVENT, () => {
          if (this.channel) {
            resolve(null);
            return;
          }
          this.channelWrapper = this.server.createChannel({
            json: false,
            setup: (channel: any) => {
              this.channel = channel;
              this.setupChannel(this.queue);
              resolve(null);
            },
          });
        });
      },
      );
      await this.setupChannel(new Set([WORKER_TO_CORE_QUEUE]));
    } catch (e) {
      this.logger.error('Can\'t start rabbitMQ server', e.message);
      throw e;
    }
  }

  public createClient<T = any>(): T {
    const amqpConnectionManagerOptions = this.getOptionsProp(this.options, 'socketOptions');
    return rqmPackage.connect(this.urls, amqpConnectionManagerOptions);
  }

  public async setupChannel(queue: string | Set<string>): Promise<void> {
    const noAck = this.getOptionsProp(this.options, 'noAck', RQM_DEFAULT_NOACK);
    let queues;

    if (!(queue instanceof Set)) {
      this.queue.add(<string>queue);
      queues = new Set([queue]);
    } else {
      for (const item of queue.keys()) {
        this.queue.add(item);
      }
      queues = queue;
    }

    for (const item of queues.keys()) {
      // eslint-disable-next-line no-await-in-loop
      await this.channel.assertQueue(item, this.queueOptions);
      // eslint-disable-next-line no-await-in-loop
      await this.channel.consume(
        item,
        (msg: Record<string, any>) => this.handleMessage(msg, this.channel),
        {
          noAck,
        },
      );
    }
  }

  public async deleteQueue(queueName: string): Promise<boolean> {
    try {
      return !!(await this.channel.deleteQueue(queueName, { ifUnused: true }));
    } catch (e) {
      this.logger.error(`rabbitMQ server purgeQueue: ${e.message}`);
      return false;
    }
  }

  private async handleMessage(
    message: Record<string, any>,
    channel: any,
  ): Promise<void> {
    try {
      const packet = this.deserializer.deserialize(message);
      const pattern = isString(packet.pattern)
        ? packet.pattern
        : JSON.stringify(packet.pattern);

      const rmqContext = new RmqContext([message, channel, pattern]);
      const handler = this.getHandlerByPattern(pattern);

      if (!handler) {
        const noHandlerMessage = {
          pattern,
          payload: packet.data,
          err: NO_MESSAGE_HANDLER,
        };
        this.logger.warn(`RMQ server no handler: ${JSON.stringify(noHandlerMessage)}`);
        channel.ack(message as Message);
        return;
      }
      this.logger.log(`RMQ -> pattern: ${pattern}, data: ${JSON.stringify(packet?.data || {})}`);
      const response$ = this.transformToObservable(
        await handler(packet.data, rmqContext)
          .then(value => {
            if (value && typeof value.pipe === 'function') {
              return value.pipe(tap({
                error(err) {
                  channel.ack(message as Message);
                  return throwError(err);
                },
                complete() {
                  channel.ack(message as Message);
                },
              }));
            }
            channel.ack(message as Message);
            return value;
          }).catch(reason => {
            channel.ack(message as Message);
            throw reason;
          }),
      ) as Observable<any>;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      response$ && this.send(response$, () => {
      });
    } catch (e) {
      channel.ack(message as Message);
      this.logger.error(`RMQ handle message FATAL error, ${JSON.stringify(message)}`, e.message);
    }
  }

  public sendMessage<T = any>(
    message: T,
    toQueue: string,
    correlationId?: string,
  ): void {
    const outgoingResponse = this.serializer.serialize(
      (message as unknown) as OutgoingResponse,
    );
    const buffer = Buffer.from(JSON.stringify(outgoingResponse));
    this.channel.sendToQueue(toQueue, buffer, { correlationId });
  }
}

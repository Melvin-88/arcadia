import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServerRMQ } from '../../rabbitMQ.strategy';
import { CoreClientCoreMessage } from './coreClient.core.message';
import { WORKER_TO_CORE_QUEUE } from './coreClient.queue.names';
import { CoreMessage } from './enum/core.message.type';
import { QueueChangeOffer } from './queueChangeOffer';

@Injectable()
export class CoreClientService implements OnModuleInit {
  private server: ServerRMQ;
  private logger: Logger = new Logger(CoreClientService.name);

  public async onModuleInit() {
    this.server = ServerRMQ.getInstance();
  }

  public async sendMessage(msg: any): Promise<void> {
    await this.server.sendMessage(msg, WORKER_TO_CORE_QUEUE, msg.correlationId);
  }

  public async sendIdleTimeoutMessage(sessionId: number, correlationId?: string): Promise<void> {
    const msg: CoreClientCoreMessage = { type: CoreMessage.IDLE_TIMEOUT, sessionId, correlationId };
    await this.sendMessage(msg);
  }

  public async sendGraceTimeoutMessage(sessionId: number, correlationId?: string): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.GRACE_TIMEOUT,
      sessionId,
      correlationId,
    };
    await this.sendMessage(msg);
  }

  public async sendEngageTimeoutMessage(sessionId: number, correlationId?: string): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.ENGAGE_TIMEOUT,
      sessionId,
      correlationId,
    };
    await this.sendMessage(msg);
  }

  public async sendQueueChangeOfferMessage(queueChangeOffer: QueueChangeOffer, correlationId?: string): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.QUEUE_CHANGE_OFFERS,
      ...queueChangeOffer,
      correlationId,
    };
    await this.sendMessage(msg);
  }

  public async sendJackpotReloginTimeoutMessage(correlationId?: string): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.JACKPOT_RELOGIN_TIMEOUT,
      correlationId,
    };
    await this.sendMessage(msg);
  }

  public async sendRoundEndDelayMessage(message: Record<string, any>): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.ROUND_END_DELAY,
      ...message,
    };
    await this.sendMessage(msg);
  }

  public async terminateViewers(sessionIds: number[]): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.TERMINATE_VIEWERS,
      ids: sessionIds,
    };
    await this.sendMessage(msg);
  }

  public async sendPingOutdatedMessage(serial: string): Promise<void> {
    const msg: CoreClientCoreMessage = {
      type: CoreMessage.PING_OUTDATED,
      serial,
    };
    await this.sendMessage(msg);
  }
}

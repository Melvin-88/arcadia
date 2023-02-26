import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CORE_TO_WORKER_QUEUE } from '../../constants/rabbit.constants';
import { WorkerMessage } from '../messaging/robot.handling/enum/worker.message';
import { PlayerClientService } from '../player.client/player.client.service';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { CoreToWorkerMessage } from './worker.interface';

@Injectable()
export class WorkerClientService implements OnModuleInit {
  private server: ServerRMQ;
  private readonly logger: Logger;

  constructor(private readonly playerClient: PlayerClientService,
  ) {
    this.logger = new Logger(WorkerClientService.name);
  }

  public async onModuleInit(): Promise<void> {
    this.server = ServerRMQ.getInstance();
  }

  public sendWorkerMessage(message: CoreToWorkerMessage, correlationId?: string): void {
    this.logger.log(`Core-to-worker message: ${JSON.stringify(message)}, correlationId: ${correlationId}`);
    this.server.sendMessage(message, CORE_TO_WORKER_QUEUE, correlationId);
  }

  public async startIdleTimeout(sessionId: number, correlationId?: string): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_IDLE_START,
      sessionId,
      correlationId,
    };
    await this.sendWorkerMessage(message, correlationId);
    this.playerClient.notifyIdleTimoutReset(sessionId);
  }

  public stopIdleTimeout(sessionId: number, correlationId?: string): void {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_IDLE_STOP,
      sessionId,
      correlationId,
    };
    this.sendWorkerMessage(message, correlationId);
  }

  public async startGraceTimeout(sessionId: number, correlationId?: string): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_GRACE_START,
      sessionId,
      correlationId,
    };
    await this.sendWorkerMessage(message, correlationId);
  }

  public async stopGraceTimeout(sessionId: number, correlationId?: string): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_GRACE_STOP,
      sessionId,
      correlationId,
    };
    await this.sendWorkerMessage(message, correlationId);
  }

  public async startEngageTimeout(sessionId: number, correlationId?: string): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_ENGAGE_START,
      sessionId,
      correlationId,
    };
    await this.sendWorkerMessage(message, correlationId);
  }

  public async stopEngageTimeout(sessionId: number, correlationId?: string): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.PLAYER_ENGAGE_STOP,
      sessionId,
      correlationId,
    };
    await this.sendWorkerMessage(message, correlationId);
  }

  public async startJackpotReloginTimeout(): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.JACKPOT_RELOGIN_START,
    };
    await this.sendWorkerMessage(message);
  }

  public async stopJackpotReloginTimeout(): Promise<void> {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.JACKPOT_RELOGIN_STOP,
    };
    await this.sendWorkerMessage(message);
  }

  public startRoundEndDelayTimeout(sessionId: number, timeout: number, correlationId?: string): void {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.ROUND_END_DELAY_START,
      sessionId,
      timeout,
      correlationId,
    };
    this.sendWorkerMessage(message, correlationId);
  }

  public stopRoundEndDelayTimeout(sessionId: number, correlationId?: string): void {
    const message: CoreToWorkerMessage = {
      type: WorkerMessage.ROUND_END_DELAY_STOP,
      sessionId,
      correlationId,
    };
    this.sendWorkerMessage(message, correlationId);
  }
}

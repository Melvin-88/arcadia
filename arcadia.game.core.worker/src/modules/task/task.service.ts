/* eslint-disable max-lines */
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JobOptions, Queue } from 'bull';
import { ConfigService } from '../config/config.service';
import { RoundEndDelayDto } from '../dto/round.end.delay.dto';
import { Cron, Timeout } from '../enum';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly removeOnComplete: number;
  private readonly removeOnFail: number;

  constructor(
    @InjectQueue(Timeout.ENGAGE) private readonly engageQueue: Queue,
    @InjectQueue(Timeout.GRACE) private readonly graceQueue: Queue,
    @InjectQueue(Timeout.IDLE) private readonly idleQueue: Queue,
    @InjectQueue(Timeout.JACKPOT_RELOGIN) private readonly jackpotReloginQueue: Queue,
    @InjectQueue(Timeout.ROUND_END_DELAY) private readonly roundEndDelayQueue: Queue,
    @InjectQueue(Cron.BALANCE_QUEUE) private readonly balanceQueueQueue: Queue,
    @InjectQueue(Cron.PING_ROBOT) private readonly pingRobotQueue: Queue,
    @InjectQueue(Cron.EXPIRE_VOUCHERS) private readonly expireVouchersQueue: Queue,
    @InjectQueue(Cron.TERMINATE_VIEWERS) private readonly terminateViewersQueue: Queue,
    private readonly configService: ConfigService,
    @Inject('CRON_DATA') private readonly cronData: Map<Cron, { jobName: string; timeout: number }>,
  ) {
    this.removeOnFail = parseInt(this.configService
      .get(['core', 'TASK_REMOVE_ON_FAIL'], '0') as string, 10);
    this.removeOnComplete = parseInt(this.configService
      .get(['core', 'TASK_REMOVE_ON_COMPLETE'], '0') as string, 10);
  }

  onModuleInit(): void {
    this.setupCronTasks();
  }

  private mapTypeToQueue(type: Timeout | Cron): Queue {
    let queue: Queue;
    switch (type) {
      case Timeout.ENGAGE: {
        queue = this.engageQueue;
        break;
      }
      case Timeout.GRACE: {
        queue = this.graceQueue;
        break;
      }
      case Timeout.IDLE: {
        queue = this.idleQueue;
        break;
      }
      case Timeout.JACKPOT_RELOGIN: {
        queue = this.jackpotReloginQueue;
        break;
      }
      case Timeout.ROUND_END_DELAY: {
        queue = this.roundEndDelayQueue;
        break;
      }
      case Cron.BALANCE_QUEUE: {
        queue = this.balanceQueueQueue;
        break;
      }
      case Cron.PING_ROBOT: {
        queue = this.pingRobotQueue;
        break;
      }
      case Cron.TERMINATE_VIEWERS: {
        queue = this.terminateViewersQueue;
        break;
      }
      case Cron.EXPIRE_VOUCHERS: {
        queue = this.expireVouchersQueue;
        break;
      }
      default: {
        throw new RpcException(`No queue for type '${type}'`);
      }
    }
    return queue;
  }

  private createCronTask(type: Cron): { name: string, data: Record<string, any>, opts: JobOptions } {
    const { jobName, timeout } = this.cronData.get(type);
    const opts: JobOptions = {
      repeat: {
        every: timeout,
      },
      removeOnComplete: true,
      removeOnFail: true,
      jobId: jobName,
    };
    return { name: jobName, data: {}, opts };
  }

  private async setupCronTasks(): Promise<void> {
    const pingTask = this.createCronTask(Cron.PING_ROBOT);
    const queueBalanceTask = this.createCronTask(Cron.BALANCE_QUEUE);
    const expireVouchersTask = this.createCronTask(Cron.EXPIRE_VOUCHERS);
    const terminateViewersTask = this.createCronTask(Cron.TERMINATE_VIEWERS);
    await this.pingRobotQueue.add(pingTask.name, pingTask.data, pingTask.opts);
    await this.balanceQueueQueue
      .add(queueBalanceTask.name, queueBalanceTask.data, queueBalanceTask.opts);
    await this.expireVouchersQueue
      .add(expireVouchersTask.name, expireVouchersTask.data, expireVouchersTask.opts);
    await this.terminateViewersQueue
      .add(terminateViewersTask.name, terminateViewersTask.data, terminateViewersTask.opts);
  }

  private async startTimeoutTask(
    timeoutType: Timeout,
    timeout: number,
    repeat = false,
    sessionId?: number,
    data?: Record<string, any>,
  ): Promise<void> {
    await this.mapTypeToQueue(timeoutType).add(timeoutType, { sessionId, ...data }, {
      jobId: `${timeoutType}${sessionId}`,
      delay: repeat ? undefined : timeout * 1000,
      repeat: repeat ? { every: timeout * 1000 } : undefined,
      removeOnComplete: this.removeOnComplete,
      removeOnFail: this.removeOnFail,
    });
  }

  private async stopTimeoutTask(timeoutType: Timeout, repeated = false, sessionId?: number): Promise<void> {
    const queue: Queue = this.mapTypeToQueue(timeoutType);
    if (repeated) {
      const repeatedJobs = await queue.getRepeatableJobs();
      const job = repeatedJobs.find(j => j.name === timeoutType);
      if (job) {
        await queue.removeRepeatableByKey(job.key);
      }
    } else {
      const job = await queue.getJob(`${timeoutType}${sessionId}`);
      if (job) {
        await job.remove();
      }
    }
  }

  public async startIdleTimeoutTask(sessionId: number, idleTimeout: number): Promise<void> {
    await this.startTimeoutTask(Timeout.IDLE, idleTimeout, false, sessionId);
  }

  public async stopIdleTimeoutTask(sessionId: number): Promise<void> {
    await this.stopTimeoutTask(Timeout.IDLE, false, sessionId);
  }

  public async startGraceTimeoutTask(sessionId: number, graceTimeout: number): Promise<void> {
    await this.startTimeoutTask(Timeout.GRACE, graceTimeout, false, sessionId);
  }

  public async stopGraceTimeoutTask(sessionId: number): Promise<void> {
    await this.stopTimeoutTask(Timeout.GRACE, false, sessionId);
  }

  public async startEngageTimeoutTask(sessionId: number, graceTimeout: number): Promise<void> {
    await this.startTimeoutTask(Timeout.ENGAGE, graceTimeout, false, sessionId);
  }

  public async stopEngageTimeoutTask(sessionId: number): Promise<void> {
    await this.stopTimeoutTask(Timeout.ENGAGE, false, sessionId);
  }

  public async startJackpotReloginTimeoutTask(timeout: number): Promise<void> {
    await this.startTimeoutTask(Timeout.JACKPOT_RELOGIN, timeout, true);
  }

  public async stopJackpotReloginTimeoutTask(): Promise<void> {
    await this.stopTimeoutTask(Timeout.JACKPOT_RELOGIN, true);
  }

  public async startRoundEndDelayTimeoutTask(data: RoundEndDelayDto): Promise<void> {
    await this.startTimeoutTask(Timeout.ROUND_END_DELAY, data.timeout, false, data.sessionId);
  }

  public async stopRoundEndDelayTask(sessionId: number): Promise<void> {
    await this.stopTimeoutTask(Timeout.ROUND_END_DELAY, false, sessionId);
  }
}

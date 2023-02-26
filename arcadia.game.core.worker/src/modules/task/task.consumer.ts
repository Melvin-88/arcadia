/* eslint-disable max-lines */
import { InjectQueue } from '@nestjs/bull';
import { Inject, OnModuleInit } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  LessThan,
  MachineRepository,
  QueueRepository,
  SessionRepository,
  SessionStatus,
  VoucherRepository,
  VoucherStatus,
} from 'arcadia-dal';
import { Job, Queue } from 'bull';
import * as moment from 'moment';
import { EMPTY, from, of } from 'rxjs';
import {
  concatMap, groupBy, map, mergeMap, toArray,
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { TO_QUEUE } from '../../constants/rabbit.constants';
import { ServerRMQ } from '../../rabbitMQ.strategy';
import { ConfigService } from '../config/config.service';
import { CoreClientService } from '../coreClient/coreClient.service';
import { QueueBalanceDto } from '../dto/queueBalanceDto';
import { RoundEndDelayDto } from '../dto/round.end.delay.dto';
import { Cron, Timeout } from '../enum';
import { AppLogger } from '../logger/logger.service';

export class TaskConsumer implements OnModuleInit {
  private serverRmq: ServerRMQ;
  private readonly queueChangeThreshold: number;

  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepository: MachineRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepository: QueueRepository,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepository: SessionRepository,
    @InjectRepository(VoucherRepository, connectionNames.DATA)
    private readonly voucherRepository: VoucherRepository,
    private readonly logger: AppLogger,
    private readonly coreClientService: CoreClientService,
    private readonly configService: ConfigService,
    @InjectQueue(Timeout.ENGAGE) private readonly engageQueue: Queue,
    @InjectQueue(Timeout.GRACE) private readonly graceQueue: Queue,
    @InjectQueue(Timeout.IDLE) private readonly idleQueue: Queue,
    @InjectQueue(Timeout.JACKPOT_RELOGIN) private readonly jackpotReloginQueue: Queue,
    @InjectQueue(Timeout.ROUND_END_DELAY) private readonly roundEndDelayQueue: Queue,
    @InjectQueue(Cron.BALANCE_QUEUE) private readonly balanceQueueQueue: Queue,
    @InjectQueue(Cron.PING_ROBOT) private readonly pingRobotQueue: Queue,
    @InjectQueue(Cron.EXPIRE_VOUCHERS) private readonly expireVouchersQueue: Queue,
    @InjectQueue(Cron.TERMINATE_VIEWERS) private readonly terminateViewersQueue: Queue,
    @Inject('CRON_DATA') private readonly cronData: Map<Cron, { jobName: string; timeout: number }>,
  ) {
    this.queueChangeThreshold = Number(this.configService.get(['core', 'QUEUE_CHANGE_THRESHOLD']));
  }

  onModuleInit(): void {
    this.serverRmq = ServerRMQ.getInstance();

    // timeouts
    this.engageQueue.process('*', 10, this.engageTimeout.bind(this));
    this.graceQueue.process('*', 10, this.graceTimeout.bind(this));
    this.idleQueue.process('*', 10, this.idleTimeout.bind(this));
    this.jackpotReloginQueue.process('*', 2, this.jackpotReloginTimeout.bind(this));
    this.roundEndDelayQueue.process('*', 2, this.roundEndDelay.bind(this));

    // cron jobs
    this.pingRobotQueue.process('*', 2,
      this.wrapCronHandler(Cron.PING_ROBOT, this.pingRobot.bind(this)));
    this.balanceQueueQueue.process('*', 2,
      this.wrapCronHandler(Cron.BALANCE_QUEUE, this.queueBalance.bind(this)));
    this.terminateViewersQueue.process('*', 2,
      this.wrapCronHandler(Cron.TERMINATE_VIEWERS, this.terminateViewers.bind(this)));
    this.expireVouchersQueue.process('*', 2,
      this.wrapCronHandler(Cron.EXPIRE_VOUCHERS, this.expireVouchers.bind(this)));
  }

  public async pingRobot(job: Job): Promise<void> {
    this.logTask(Cron.PING_ROBOT, job);
    try {
      const timeout: number = (job.opts.repeat as any).every;
      const lastPing = moment().subtract(timeout, 'milliseconds').toDate();
      const machines = await this.machineRepository.getMachinesToPing(lastPing);
      machines.forEach(machine => {
        if (machine.pingDate
          && moment().diff(machine.pingDate, 'milliseconds') > Math.round(timeout * 2.5)) {
          this.coreClientService.sendPingOutdatedMessage(machine.serial);
        } else {
          const robotQueue = ServerRMQ.getQueueName(TO_QUEUE, machine.serial);
          this.logger.log(`Ping robot, serial: ${machine.serial}`);
          this.serverRmq.sendMessage({ action: 'ping' }, robotQueue);
        }
      });
    } catch (e) {
      this.logTaskError(Cron.PING_ROBOT, e);
    }
  }

  public async expireVouchers(job: Job): Promise<void> {
    this.logTask(Cron.EXPIRE_VOUCHERS, job);
    try {
      await this.voucherRepository.update({
        status: VoucherStatus.PENDING,
        session: null,
        expirationDate: LessThan(new Date()),
      }, { status: VoucherStatus.EXPIRED });
    } catch (e) {
      this.logTaskError(Cron.EXPIRE_VOUCHERS, e);
    }
  }

  public async terminateViewers(job: Job): Promise<void> {
    this.logTask(Cron.TERMINATE_VIEWERS, job);
    const threshold = Number(this.configService.get(['core', 'TERMINATE_VIEWERS_THRESHOLD_SEC']));
    try {
      const ids = await this.sessionRepository.getStaleViewers(threshold);
      if (ids?.length) {
        await this.coreClientService.terminateViewers(ids);
      }
    } catch (e) {
      this.logTaskError(Cron.TERMINATE_VIEWERS, e);
    }
  }

  public async queueBalance(job: Job): Promise<void> {
    const correlationId = uuidv4();
    this.logTask(Cron.BALANCE_QUEUE, job, { correlationId });
    try {
      const queueData = await this.queueRepository.getQueueLengthData();
      const toBalance: QueueBalanceDto[] = await from(queueData).pipe(
        mergeMap(queueBalanceData => {
          const { operatorIds, ...rest } = queueBalanceData;
          return from(operatorIds)
            .pipe(map(id => ({ operatorId: id, ...rest })));
        }),
        groupBy(value => `${value.operatorId}-${value.denominator}`,
          value => ({ queueId: value.queueId, queueLength: value.queueLength })),
        mergeMap(group => group.pipe(toArray())),
        mergeMap(queues => {
          if (queues?.length > 1) {
            const queuesSorted = queues.sort((a, b) => a.queueLength - b.queueLength);
            const shortest = queuesSorted[0];
            const longest = queuesSorted[queuesSorted.length - 1];
            if (longest.queueLength - shortest.queueLength > this.queueChangeThreshold) {
              return of({ fromQueue: longest, toQueue: shortest });
            }
          }
          return EMPTY;
        }),
        toArray(),
      ).toPromise();
      if (!toBalance?.length) {
        return;
      }
      const queues = await this.queueRepository
        .findByIds(toBalance.flatMap(value => [value.fromQueue.queueId, value.toQueue.queueId]),
          { relations: ['sessions'] });
      const queuesMap = new Map(queues.map(value => [Number(value.id), value]));
      await from(toBalance).pipe(
        mergeMap(({ fromQueue, toQueue }) => {
          const fromSessions = queuesMap.get(fromQueue.queueId).sessions;
          if (!fromSessions?.length) {
            return EMPTY;
          }
          const candidate = fromSessions
            .filter(session => session.status === SessionStatus.QUEUE
              && !session.isDisconnected
              && !session.offeredQueueId)
            .sort((a, b) => b.buyDate.valueOf() - a.buyDate.valueOf())[0];
          if (candidate) {
            const position = fromSessions.filter(session => session.status === SessionStatus.QUEUE
              || session.status === SessionStatus.QUEUE_BET_BEHIND)
              .sort((a, b) => a.buyDate.valueOf() - b.buyDate.valueOf())
              .indexOf(candidate);
            if (position - toQueue.queueLength > 0) {
              candidate.offeredQueueId = toQueue.queueId;
              return of({
                candidate,
                toQueueId: toQueue.queueId,
                position: toQueue.queueLength + 1,
              });
            }
          }
          return EMPTY;
        }),
        toArray(),
        mergeMap(async value => {
          await this.sessionRepository.save(value.map(value => value.candidate),
            { transaction: false, reload: false });
          return value.map(value => ({
            sessionId: Number(value.candidate.id),
            toQueueId: value.toQueueId,
            position: value.position,
          }));
        }),
        mergeMap(value => from(value)),
        concatMap(async value => {
          await this.coreClientService.sendQueueChangeOfferMessage(value, correlationId);
          return value;
        }),
        toArray())
        .toPromise();
      this.logger.log(`to balance: ${JSON.stringify(toBalance)}`);
    } catch (e) {
      this.logTaskError(Cron.BALANCE_QUEUE, e);
    }
  }

  public async idleTimeout(job: Job<{ sessionId: number }>): Promise<void> {
    const correlationId = uuidv4();
    this.logTask(Timeout.IDLE, job, { correlationId });
    try {
      await this.coreClientService.sendIdleTimeoutMessage(job.data.sessionId, correlationId);
    } catch (e) {
      this.logTaskError(Timeout.IDLE, e);
    }
  }

  public async graceTimeout(job: Job<{ sessionId: number }>): Promise<void> {
    const correlationId = uuidv4();
    this.logTask(Timeout.GRACE, job, { correlationId });
    try {
      await this.coreClientService.sendGraceTimeoutMessage(job.data.sessionId, correlationId);
    } catch (e) {
      this.logTaskError(Timeout.GRACE, e);
    }
  }

  public async engageTimeout(job: Job<{ sessionId: number }>): Promise<void> {
    const correlationId = uuidv4();
    this.logTask(Timeout.ENGAGE, job, { correlationId });
    try {
      await this.coreClientService.sendEngageTimeoutMessage(job.data.sessionId, correlationId);
    } catch (e) {
      this.logTaskError(Timeout.ENGAGE, e);
    }
  }

  public async jackpotReloginTimeout(job: Job<{ sessionId: number }>): Promise<void> {
    const correlationId = uuidv4();
    this.logTask(Timeout.JACKPOT_RELOGIN, job, { correlationId });
    try {
      await this.coreClientService.sendJackpotReloginTimeoutMessage(correlationId);
    } catch (e) {
      this.logTaskError(Timeout.JACKPOT_RELOGIN, e);
    }
  }

  public async roundEndDelay(job: Job<RoundEndDelayDto>): Promise<void> {
    const correlationId = uuidv4();
    const message = { ...job.data, correlationId };
    this.logTask(Timeout.ROUND_END_DELAY, job, { correlationId });
    try {
      await this.coreClientService.sendRoundEndDelayMessage(message);
    } catch (e) {
      this.logTaskError(Timeout.ROUND_END_DELAY, e);
    }
  }

  private logTask(taskName: string, job: Job, params: Record<string, any> = {}) {
    this.logger.log(
      JSON.stringify({
        task: taskName,
        opts: job.opts,
        data: job.data,
        ...params,
      }),
    );
  }

  private logTaskError(taskName: string, error: any) {
    this.logger.log(
      JSON.stringify({ taskName, error }),
    );
  }

  private async removeStaleJob(type: Cron, job: Job): Promise<void> {
    const { jobName } = this.cronData.get(type);
    if (job.name !== jobName) {
      await job.queue.removeRepeatable(job.name, job.opts.repeat);
    }
  }

  private wrapCronHandler(type: Cron, handler: (job: Job) => Promise<void>): (job: Job) => Promise<void> {
    return job => handler(job).then(() => this.removeStaleJob(type, job));
  }
}

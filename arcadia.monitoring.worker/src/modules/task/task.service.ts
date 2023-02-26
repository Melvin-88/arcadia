import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import { ConfigService } from '../config/config.service';
import { BullQueues } from '../enum/bull.queues';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly removeOnComplete: number;
  private readonly removeOnFail: number;
  constructor(
    @InjectQueue(BullQueues.KPI_TASK) private readonly kpiTaskQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.removeOnFail = parseInt(this.configService.get(['core', 'TASK_REMOVE_ON_FAIL'], '0') as string, 10);
    this.removeOnComplete = parseInt(this.configService.get(['core', 'TASK_REMOVE_ON_COMPLETE'], '0') as string, 10);
  }

  onModuleInit() {
    this.setupCronTasks();
  }

  private async setupCronTasks() {
    const kpiTask = this.getKpiTask();
    await this.kpiTaskQueue.add(kpiTask.name, kpiTask.data, kpiTask.opts);
  }

  private getKpiTask() {
    const timeout = parseInt(
      this.configService.get(
        ['core', 'KPI_INTERVAL_SEC'],
        '60',
      ) as string,
      10,
    ) * 1000;
    const opts: JobOptions = {
      repeat: {
        every: timeout,
      },
      removeOnComplete: true,
      removeOnFail: true,
      jobId: 'kpi',
    };
    return { name: 'kpiTask', data: {}, opts };
  }
}

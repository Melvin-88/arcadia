import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { connectionNames, InjectRepository, SessionRepository } from 'arcadia-dal';
import { ConfigService } from './modules/config/config.service';
import { RoundEndDelayDto } from './modules/dto/round.end.delay.dto';
import { SessionAwareDto } from './modules/dto/session.aware.dto';
import { TaskService } from './modules/task/task.service';

@Injectable()
export class AppService {
  private readonly jackpotReloginTimeout: number;

  constructor(
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepository: SessionRepository,
    private readonly taskService: TaskService,
    private readonly config: ConfigService,
  ) {
    this.jackpotReloginTimeout = parseInt((this.config
      .get(['core', 'JACKPOT_RELOGIN_TIMEOUT'], '30') as string), 10);
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async playerIdleStart(sessionId: number): Promise<void> {
    const session = await this.sessionRepository.findOne(sessionId, { relations: ['group'] });
    if (!session) {
      throw new RpcException(`Session with id ${sessionId} not found`);
    }
    await this.taskService.stopIdleTimeoutTask(sessionId);
    const { idleTimeout, graceTimeout } = session.group;
    await this.taskService.startIdleTimeoutTask(sessionId, (idleTimeout + graceTimeout));
  }

  public async handlePlayerIdleStop(sessionId: number): Promise<void> {
    await this.taskService.stopIdleTimeoutTask(sessionId);
  }

  public async playerGraceStart(sessionId: number): Promise<void> {
    const session = await this.sessionRepository.findOne(sessionId, { relations: ['group'] });
    if (!session) {
      throw new RpcException(`Session with id ${sessionId} not found`);
    }
    await this.taskService.stopGraceTimeoutTask(sessionId);
    const { idleTimeout, graceTimeout } = session.group;
    await this.taskService.startGraceTimeoutTask(sessionId, (idleTimeout + graceTimeout));
  }

  public async handlePlayerGraceStop(sessionId: number): Promise<void> {
    await this.taskService.stopGraceTimeoutTask(sessionId);
  }

  public async handleStartEngage(sessionId: number): Promise<void> {
    const session = await this.sessionRepository.findOne(sessionId, { relations: ['group'] });
    if (!session) {
      throw new RpcException(`Session with id ${sessionId} not found`);
    }
    await this.taskService.stopEngageTimeoutTask(sessionId);
    await this.taskService.startEngageTimeoutTask(sessionId, session.group.engageTimeout);
  }

  public async handleStopEngage(sessionId: number): Promise<void> {
    await this.taskService.stopEngageTimeoutTask(sessionId);
  }

  public async handleStartJackpotRelogin(): Promise<void> {
    await this.taskService.startJackpotReloginTimeoutTask(this.jackpotReloginTimeout);
  }

  public async handleStopJackpotRelogin(): Promise<void> {
    await this.taskService.stopJackpotReloginTimeoutTask();
  }

  public async roundEndDelayStart(data: RoundEndDelayDto): Promise<void> {
    await this.taskService.stopRoundEndDelayTask(data.sessionId);
    await this.taskService.startRoundEndDelayTimeoutTask(data);
  }

  public async roundEndDelayStop(data: SessionAwareDto): Promise<void> {
    await this.taskService.stopRoundEndDelayTask(data.sessionId);
  }
}

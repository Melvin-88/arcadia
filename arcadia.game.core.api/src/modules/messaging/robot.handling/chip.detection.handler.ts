import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RoundRepository } from 'arcadia-dal';
import { TransactionalHandler } from '../../common/transactional.handler';
import { ConfigService } from '../../config/config.service';
import { AppLogger } from '../../logger/logger.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { RobotToCoreBaseMessage } from './dto';

@Injectable({ scope: Scope.REQUEST })
export class ChipDetectionHandler extends TransactionalHandler<RobotToCoreBaseMessage> {
  private roundRepo: RoundRepository;

  private readonly roundEndDelaySec: number;

  constructor(logger: AppLogger,
              private readonly config: ConfigService,
              private readonly workerClient: WorkerClientService) {
    super(logger);
    this.roundEndDelaySec = Number(this.config.get(['core', 'ROUND_END_DELAY_SECONDS']));
  }

  protected async init(data: RobotToCoreBaseMessage): Promise<void> {
    await super.init(data);

    // transactional repo
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.sessionId,
      {
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected async handleEvent(): Promise<void> {
    if (this.canSkip()) {
      return;
    }
    const activeRound = this.lockedSession.getActiveRound();
    if (!activeRound) {
      throw new RpcException(`Chip detection out of active round. SessionId: ${this.lockedSession.id}`);
    }
    if (activeRound.coins === 0) {
      this.workerClient.startRoundEndDelayTimeout(this.lockedSession.id, this.roundEndDelaySec);
    }
  }

  private canSkip(): boolean {
    return this.lockedSession.roundsLeft > 0 && !this.lockedSession.willDisengage();
  }
}

import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RoundEntity, RoundRepository } from 'arcadia-dal';
import { TransactionalHandler } from '../../common/transactional.handler';
import { ConfigService } from '../../config/config.service';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { RobotCoinDto } from './dto';

@Injectable({ scope: Scope.REQUEST })
export class CoinShotHandler extends TransactionalHandler<RobotCoinDto> {
  private roundRepo: RoundRepository;

  private activeRound: RoundEntity;
  private readonly roundEndDelaySec: number;

  constructor(
    logger: AppLogger,
    private readonly config: ConfigService,
    private readonly robotClientService: RobotClientService,
    private readonly playerPublisher: PlayerClientService,
    private readonly workerClient: WorkerClientService,
    private readonly monitoringClientService: MonitoringWorkerClientService,
  ) {
    super(logger);
    this.roundEndDelaySec = Number(this.config.get(['core', 'ROUND_END_DELAY_SECONDS']));
  }

  protected async init(data: RobotCoinDto): Promise<void> {
    await super.init(data);

    // transactional repos
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.cachedSession.id,
      {
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected async handleEvent(): Promise<void> {
    this.activeRound = this.lockedSession.getActiveRound();
    if (!this.activeRound) {
      throw new RpcException(`Coin shot handler: no active round! SessionId: ${this.lockedSession.id}`);
    }
    await this.roundRepo.decrement({ id: this.activeRound.id }, 'coins', 1);
    this.activeRound.coins -= 1;
    this.rtpPush();
    this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.COIN_DISPENSED,
      source: EventSource.ROBOT,
      params: {
        remainingCoins: this.activeRound.coins,
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
        machineId: this.cachedMachine.id,
        groupId: this.cachedGroup.id,
        operatorId: this.cachedOperator.id,
      },
    });
    if (this.isRoundEnd()) {
      this.workerClient.stopIdleTimeout(this.lockedSession.id, this.correlationId);
      this.workerClient.startRoundEndDelayTimeout(this.lockedSession.id, this.roundEndDelaySec);
    } else {
      await this.workerClient.startIdleTimeout(this.lockedSession.id, this.correlationId);
    }
    this.playerPublisher.broadcastRemainingCoins(this.cachedMachine.serial, this.activeRound.coins);
  }

  private isRoundEnd(): boolean {
    return this.activeRound.coins <= 0;
  }

  private rtpPush(): void {
    const afterCoin = this.cachedGroup.stackSize - this.activeRound.coins;
    const toPush = this.activeRound?.rtp?.find(value => value.afterCoin === afterCoin);
    if (toPush) {
      const dispensers = new Map(Object.entries(this.lockedSession.configuration.dispensers)
        .map(([dispenserId, dispenser]) => [dispenser.chipType, dispenserId]));
      toPush.types.forEach(type => {
        const dispenserId = dispensers.get(type);
        if (dispenserId) {
          this.robotClientService.sendPushMessage(dispenserId, this.cachedMachine.serial);
          this.monitoringClientService
            .sendOutOfSessionEventLogMessage(this.cachedMachine.serial, {
              source: EventSource.GAME,
              eventType: EventType.PUSH,
              params: {
                machineSerial: this.cachedMachine.serial,
                dispenserId,
              },
            });
        }
      });
    }
  }
}

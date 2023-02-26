import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  ChipEntity,
  ChipRepository,
  ChipTypeEntity,
  PlayerRepository,
  RoundEntity,
  RoundRepository,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import { toCash } from '../../../util/toCash';
import { TransactionalHandler } from '../../common/transactional.handler';
import { BetBehindWinEvent } from '../../event.bus/dto/bet.behind.win.event';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { PlayerWinMessage } from '../player.handling/player.interface';

@Injectable({ scope: Scope.REQUEST })
export class BbWinHandler extends TransactionalHandler<BetBehindWinEvent> {
  private roundRepo: RoundRepository;
  private chipRepo: ChipRepository;
  private playerRepo: PlayerRepository;

  private activeRound: RoundEntity;
  private chip: ChipEntity;
  private chipType: ChipTypeEntity;

  constructor(
    logger: AppLogger,
    private readonly playerPublisher: PlayerClientService,
    private readonly monitoringClientService: MonitoringWorkerClientService,
    private readonly sessionDataManager: SessionDataManager,
  ) {
    super(logger);
  }

  protected async init(data: BetBehindWinEvent): Promise<void> {
    await super.init(data);

    this.chip = data.chip;
    this.chipType = data.chipType;

    // transactional repos init
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
    this.chipRepo = this.entityManager.getCustomRepository(ChipRepository);
    this.playerRepo = this.entityManager.getCustomRepository(PlayerRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.sessionId,
      {
        // todo: remove rounds from lock, get active round from db directly
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected async handleEvent(): Promise<void> {
    this.activeRound = this.lockedSession.getActiveRound();
    if (!this.activeRound) {
      throw new RpcException(`BB win out of active round. SessionId: ${this.lockedSession.id}`);
    }
    const winInCash = toCash(this.chip.value, this.lockedSession.currencyConversionRate);
    await this.winLimitCheck(winInCash);
    await this.countWins(this.chip.value, winInCash);
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.PRIZE,
      source: EventSource.GAME,
      params: {
        sum: this.chip.value,
        sessionId: this.cachedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
    const winData: PlayerWinMessage = {
      currencyValue: winInCash,
      type: this.chipType.name,
      soundId: this.chipType.soundId,
      iconId: this.chipType.iconId,
    };
    this.playerPublisher.notifyWin(this.lockedSession.id, winData);
    const totalWinInCash = new BigNumber(this.lockedSession.totalWinInCash).plus(winInCash)
      .dp(2).toNumber();
    this.playerPublisher.notifyTotalWin(this.lockedSession.id, { totalWin: totalWinInCash });
  }

  private async winLimitCheck(winInCash: number) {
    const { betBehind } = await this.sessionDataManager.getSessionData(this.lockedSession.id);
    if (!betBehind) {
      return;
    }
    if (winInCash >= betBehind.singleWinThreshold) {
      await this.sessionDataManager.removeSessionData({ betBehind: {} as any },
        this.lockedSession.id);
    }
  }

  private async countWins(winInValue: number, winInCash: number) {
    await this.sessionRepo.countWin(this.lockedSession.id, winInValue, winInCash);
    await this.roundRepo.countWin(this.activeRound.id, winInValue, winInCash);
    await this.playerRepo.countWin(this.cachedPlayer.cid, winInValue);
  }
}

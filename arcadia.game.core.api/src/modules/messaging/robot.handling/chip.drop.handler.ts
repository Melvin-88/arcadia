/* eslint-disable max-lines */
import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  ChipEntity,
  ChipRepository,
  connectionNames,
  InjectRepository,
  MachineRepository,
  PlayerRepository,
  RngChipPrizeRepository,
  RoundEntity,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionStatus,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import { PHANTOM_CHIP_TYPE_NAME } from '../../../constants/phantom.type';
import { toCash } from '../../../util/toCash';
import { TransactionalHandler } from '../../common/transactional.handler';
import { ConfigService } from '../../config/config.service';
import { BusEventType } from '../../event.bus/bus.event.type';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { AutoplayStatus } from '../player.handling/enum/autoplay.status';
import { PlayerWinMessage } from '../player.handling/player.interface';
import { RobotChipDropDto } from './dto';

@Injectable({ scope: Scope.REQUEST })
export class ChipDropHandler extends TransactionalHandler<RobotChipDropDto> {
  // transactional repos
  private roundRepo: RoundRepository;
  private chipRepo: ChipRepository;
  private playerRepo: PlayerRepository;

  private rfid: string;
  private serial: string;
  private chip: ChipEntity;
  private activeRound: RoundEntity;
  private readonly roundEndDelaySec: number;

  constructor(
    logger: AppLogger,
    private readonly config: ConfigService,
    private readonly robotClientService: RobotClientService,
    private readonly playerClientService: PlayerClientService,
    private readonly workerClientService: WorkerClientService,
    private readonly monitoringClientService: MonitoringWorkerClientService,
    private readonly workerClient: WorkerClientService,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA)
    private readonly prizeRepo: RngChipPrizeRepository,
    private readonly eventPublisher: EventBusPublisher,
    private readonly sessionDataManager: SessionDataManager,
  ) {
    super(logger);
    this.roundEndDelaySec = Number(this.config.get(['core', 'ROUND_END_DELAY_SECONDS']));
  }

  protected async init(data: RobotChipDropDto): Promise<void> {
    await super.init(data);

    // message payload
    this.rfid = data.rfid;
    this.serial = data.serial;

    // transactional repos init
    this.roundRepo = this.entityManager.getCustomRepository(RoundRepository);
    this.chipRepo = this.entityManager.getCustomRepository(ChipRepository);
    this.playerRepo = this.entityManager.getCustomRepository(PlayerRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.sessionId,
      {
        relations: ['rounds'],
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected async handleEvent(): Promise<void> {
    const [machine, chip] = await Promise.all([
      this.machineRepo.findOneOrFail({ serial: this.serial }, { relations: ['group', 'site'] }),
      this.chipRepo.findOne({ rfid: this.rfid }, { relations: ['type', 'machine', 'site'] }),
    ]);
    if (!chip) {
      this.logger.log(`Chip not found, rfid: ${this.rfid}`);
      await this.monitoringClientService.sendAlertMessage({
        alertType: AlertType.WARNING,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Chip not found',
        additionalInformation: {
          rfid: this.rfid,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      return;
    }
    this.cachedMachine = machine;
    this.chip = chip;
    await this.unregisterChip();
    this.activeRound = this.lockedSession.getActiveRound();

    if (!await this.validateChipDrop()) {
      this.logger.log(`Invalid chip dropped, chip: ${JSON.stringify(chip)}`);
      await this.monitoringClientService.sendAlertMessage({
        alertType: AlertType.WARNING,
        source: AlertSource.GAME_CORE,
        severity: AlertSeverity.HIGH,
        description: 'Invalid chip dropped',
        additionalInformation: {
          chip,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      await this.monitoringClientService.sendEventLogMessage({
        eventType: EventType.ILLEGAL_CHIP_DROP,
        source: EventSource.GAME,
        params: {
          sessionId: this.lockedSession.id,
          round: this.activeRound?.id,
          groupId: this.cachedGroup.id,
          machineSerial: machine.serial,
          machineId: machine.id,
          operatorId: this.cachedOperator.id,
        },
      });
      return;
    }

    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.CHIP_DROP,
      source: EventSource.ROBOT,
      params: {
        rfid: chip.rfid,
        type: chip.type.name,
        value: chip.value,
        round: this.activeRound?.id,
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
        groupId: this.cachedGroup.id,
        machineId: this.cachedMachine.id,
        operatorId: this.cachedOperator.id,
      },
    });

    if (!this.activeRound) {
      throw new RpcException(`Chip drop out of active round. SessionId: ${this.lockedSession.id}`);
    }

    if (!this.canSkipRoundEndDelay()) {
      this.workerClient.startRoundEndDelayTimeout(this.lockedSession.id, this.roundEndDelaySec);
    }

    await this.phantomChipDropHandler();

    if (this.isCountWin()) {
      const winInCash = toCash(this.chip.value, this.lockedSession.currencyConversionRate);
      await this.autoplayWinLimitCheck(winInCash);
      await this.countWins(this.chip.value, winInCash);
      await this.monitoringClientService.sendEventLogMessage({
        eventType: EventType.PRIZE,
        source: EventSource.GAME,
        params: {
          sum: chip.value,
          sessionId: this.lockedSession.id,
          machineSerial: this.cachedMachine.serial,
          playerCid: this.cachedPlayer.cid,
        },
      });
      const winData: PlayerWinMessage = {
        type: this.chip.type.name,
        currencyValue: winInCash,
        soundId: this.chip.type.soundId,
        iconId: this.chip.type.iconId,
      };
      await this.playerClientService.notifyWin(this.lockedSession.id, winData);
      const totalWinInCash = new BigNumber(this.lockedSession.totalWinInCash).plus(winInCash)
        .dp(2).toNumber();
      await this.playerClientService
        .notifyTotalWin(this.lockedSession.id, { totalWin: totalWinInCash });
      await this.notifyBbWins();
    }
  }

  private canSkipRoundEndDelay(): boolean {
    return (this.lockedSession.roundsLeft > 0 && !this.lockedSession.willDisengage())
      || this.activeRound.coins > 0;
  }

  private async notifyBbWins(): Promise<void> {
    const bbSessions = await this.sessionRepo.getBetBehindersFromQueue(this.cachedSession.queue.id);
    bbSessions
      .filter(({ rounds }) => rounds.find(round => round.status === RoundStatus.ACTIVE
        && round.type === RoundType.BET_BEHIND))
      .forEach(session => this.eventPublisher.sendBetBehindWin({
        type: BusEventType.BET_BEHIND_WIN,
        sessionId: session.id,
        chip: this.chip,
        chipType: this.chip.type,
      }, this.correlationId));
  }

  private async countWins(winInValue: number, winInCash: number) {
    await this.sessionRepo.countWin(this.cachedSession.id, winInValue, winInCash);
    await this.roundRepo.countWin(this.activeRound.id, winInValue, winInCash);
    await this.playerRepo.countWin(this.cachedPlayer.cid, winInValue);
  }

  private isCountWin(): boolean {
    return this.chip.value > 0 && !this.chip.isScatter;
  }

  private async unregisterChip() {
    await this.chipRepo.update(this.chip.rfid,
      { machine: null, isScatter: false, value: 0 });
  }

  private async validateChipDrop(): Promise<boolean> {
    const prize = await this.prizeRepo.getChipPrize(this.cachedGroup.prizeGroup,
      this.chip.type.id, this.lockedSession.configuration.rtpSegment);
    return prize
      && this.chip.machine?.id === this.cachedMachine.id
      && this.chip.site.id === this.cachedMachine.site.id;
  }

  private async phantomChipDropHandler(): Promise<void> {
    if (this.chip.type.name !== PHANTOM_CHIP_TYPE_NAME) {
      return;
    }
    if (this.isPhantomValueChip()) {
      const winAmount = toCash(this.chip.value, this.lockedSession.currencyConversionRate);
      this.playerClientService.notifyPhantom(this.lockedSession.id, { value: winAmount });
      await this.monitoringClientService.sendEventLogMessage({
        eventType: EventType.PHANTOM_PAYOUT,
        source: EventSource.GAME,
        params: {
          sessionId: this.lockedSession.id,
          machineSerial: this.cachedMachine.serial,
          machineId: this.cachedMachine.id,
          groupId: this.cachedGroup.id,
          operatorId: this.cachedOperator.id,
          round: this.activeRound.id,
          sum: winAmount,
        },
      });
    } else {
      await this.sessionRepo.registerScatter(this.lockedSession.id);
      this.lockedSession.pendingScatter += 1;
      this.playerClientService.notifyPhantom(this.lockedSession.id, { value: -1 });
    }
  }

  private isPhantomValueChip(): boolean {
    return this.chip.type.name === PHANTOM_CHIP_TYPE_NAME
      && !this.chip.isScatter
      && this.chip.value > 0;
  }

  private async autoplayWinLimitCheck(winAmount: number) {
    const { autoplay } = await this.sessionDataManager.getSessionData(this.lockedSession.id);
    if (this.lockedSession.status !== SessionStatus.AUTOPLAY || !autoplay) {
      return;
    }
    if (winAmount >= autoplay.singleWinThreshold) {
      await this.disableAutoplay();
    }
  }

  private async disableAutoplay() {
    await this.robotClientService
      .sendStopAutoplayMessage(this.cachedMachine.serial, this.lockedSession.id);
    await this.monitoringClientService.sendEventLogMessage({
      eventType: EventType.STOP_AUTO_MODE,
      source: EventSource.GAME,
      params: {
        sessionId: this.lockedSession.id,
        machineSerial: this.cachedMachine.serial,
        playerCid: this.cachedPlayer.cid,
      },
    });
    this.playerClientService
      .notifyAutoplay(this.lockedSession.id, { status: AutoplayStatus.FORCED_DISABLE });
    await this.workerClientService.startIdleTimeout(this.lockedSession.id, this.correlationId);
    await this.sessionRepo.update(this.lockedSession.id, { status: SessionStatus.PLAYING },
      data => this.playerClientService
        .sessionState(this.lockedSession.id, { status: data.status }));
    await this.sessionDataManager
      .removeSessionData({ autoplay: {} as any }, this.lockedSession.id);
  }
}

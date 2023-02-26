/* eslint-disable max-lines */
import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  ChipEntity,
  ChipRepository,
  connectionNames,
  getManager,
  GroupEntity,
  GroupRepository,
  InjectRepository,
  MachineDispenserRepository,
  MachineEntity,
  MachineRepository,
  MachineStatus,
  MaintenanceType,
  QueueRepository,
  QueueStatus,
  RngChipPrizeRepository,
  RoundEntity,
  RoundStatus,
  RoundType,
  SeedHistoryRepository,
  SessionEndReason,
  SessionEntity,
  SessionRepository,
  SessionStatus,
  ShutdownReason,
  TiltMode,
  VoucherStatus,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import * as moment from 'moment';
import {
  EMPTY, from, interval, of, zip,
} from 'rxjs';
import {
  concatMap, mergeMap, repeat, toArray,
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PHANTOM_CHIP_TYPE_NAME } from '../../../constants/phantom.type';
import { CacheClear } from '../../../decorators/cache.clear';
import { toCash } from '../../../util/toCash';
import { ConfigValidator } from '../../config.validator/configValidator';
import { ConfigService } from '../../config/config.service';
import { BusEventType } from '../../event.bus/bus.event.type';
import { EventBusPublisher } from '../../event.bus/event.bus.publisher';
import { REDIS_CACHE } from '../../global.cache/redis.cache.module';
import { GroupTerminatorService } from '../../group.terminator/group.terminator.service';
import { AppLogger } from '../../logger/logger.service';
import { EventSource, EventType } from '../../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { NotificationType } from '../../player.client/notification.type';
import { PlayerClientService } from '../../player.client/player.client.service';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';
import { RngClientService } from '../../rng.service.client/rng.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { RoundContext } from '../../round/round.context';
import { RoundServiceFactory } from '../../round/round.service.factory';
import { SessionDataManager } from '../../session.data.manager/sessionDataManager';
import { sessionCacheKeyFactory } from '../../session/session.cache.key.factory';
import { SessionService } from '../../session/session.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { RobotPositionDto, RobotToCoreBaseMessage } from './dto';

@Injectable()
export class RobotMessageService {
  private readonly secret: string;

  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepo: ChipRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    @InjectRepository(MachineDispenserRepository, connectionNames.DATA)
    private readonly dispenserRepo: MachineDispenserRepository,
    @InjectRepository(SeedHistoryRepository, connectionNames.DATA)
    private readonly seedHistoryRepo: SeedHistoryRepository,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA)
    private readonly rngChipPrizeRepo: RngChipPrizeRepository,
    @InjectRepository(GroupRepository, connectionNames.DATA)
    private readonly groupRepo: GroupRepository,
    private readonly sessionService: SessionService,
    private readonly robotClientService: RobotClientService,
    private readonly playerPublisher: PlayerClientService,
    private readonly workerClient: WorkerClientService,
    private readonly monitoringClient: MonitoringWorkerClientService,
    private readonly configService: ConfigService,
    private readonly queueManager: QueueManagerService,
    @Inject(REDIS_CACHE) public readonly cacheManager: CacheManager.Cache,
    private readonly rngClient: RngClientService,
    private readonly roundServiceFactory: RoundServiceFactory,
    private readonly logger: AppLogger,
    private readonly groupTerminator: GroupTerminatorService,
    private readonly sessionDataManager: SessionDataManager,
    private readonly configValidator: ConfigValidator,
    private readonly eventPublisher: EventBusPublisher,
  ) {
    this.secret = this.configService.get(['core', 'ROBOTS_AUTH_SECRET']) as string;
  }

  public async loginRobot(serial: string, secret: string, env?: string | undefined): Promise<any> {
    if (this.secret !== secret) {
      throw new UnauthorizedException('Incorrect secret');
    }
    const machine = await this.machineRepo.findOneOrFail({ serial },
      { relations: ['queue'] })
      .catch(() => {
        throw new NotFoundException(`Machine with serial: ${serial} not found!`);
      });
    await this.configValidator.getValidatedConfig(machine.serial);
    if (!machine.queue) {
      const queue = await this.queueRepo.getFreeQueue();
      await this.queueRepo.update(queue.id, { machine });
    } else if (machine.queue.status !== QueueStatus.STOPPED) {
      await this.queueRepo.update(machine.queue.id, { status: QueueStatus.STOPPED });
    }

    await this.machineRepo.update(machine.id, {
      status: MachineStatus.OFFLINE,
      lastLoginDate: new Date(),
    });

    const queues: { publisher: string; subscriber: string } = ServerRMQ.getConnectors(machine.serial);
    const serverRMQ: ServerRMQ = ServerRMQ.getInstance();

    await serverRMQ.deleteQueue(queues.subscriber);

    return {
      queues,
      robotKey: machine.id,
      mgrMessageServer: this.configService.getRabbitMQConfig(env !== 'emu'),
      playerMessageServer: {
        redis: this.configService.getRedisConfig(env !== 'emu'),
        key: 'socket.io',
      },
    };
  }

  public async handleEngaged(data: RobotToCoreBaseMessage): Promise<void> {
    const session = await this.sessionRepo
      .findOne(data.session.id, { relations: ['rounds'] });
    await this.workerClient.stopEngageTimeout(session.id, data.correlationId);
    const { coins } = session.rounds
      .find(({ status }) => status === RoundStatus.ACTIVE);
    const { machine } = data.session;
    await this.robotClientService.sendAllowCoinsMessage(coins, machine.serial, session.id);
    await this.sessionRepo.update(session.id, {
      queueDuration: moment()
        .diff(session.createDate, 'seconds') - session.viewerDuration,
    });
    if (session.isDisconnected) {
      await this.sessionRepo.update(session.id, { status: SessionStatus.FORCED_AUTOPLAY },
        data => this.playerPublisher.sessionState(session.id, { status: data.status }));
      await this.robotClientService.sendAutoplayMessage(machine.serial, session.id, TiltMode.AUTO);
    } else {
      await this.workerClient.startIdleTimeout(data.session.id, data.correlationId);
      await this.monitoringClient.sendEventLogMessage({
        eventType: EventType.ENGAGED,
        source: EventSource.ROBOT,
        params: {
          sessionId: data.session.id,
          machineSerial: data.serial,
        },
      });
      await this.sessionRepo.update(session.id, { status: SessionStatus.PLAYING },
        data => this.playerPublisher.sessionState(session.id, { status: data.status }));
    }
    await this.machineRepo.update(machine.id, { status: MachineStatus.IN_PLAY });
    await this.queueManager.notifyQueueUpdate(data.session.queue.id, session);
    this.logger.log(`Machine ${machine.serial} started game session, sessionId: ${session.id}`);
  }

  @CacheClear(args => sessionCacheKeyFactory(args[0].sessionId || 'none'))
  public async handleDisengaged(data: RobotToCoreBaseMessage): Promise<void> {
    if (!data.sessionId) {
      throw new RpcException('No-session disengage');
    }
    const session = await this.sessionRepo.findOne(data.sessionId);
    if (!session) {
      this.logger.error(`No session found on disengage, sessionId: ${data.sessionId}`);
      await this.seeding(data.serial);
      return;
    }
    const { machine, queue } = data.session;
    await this.monitoringClient.sendEventLogMessage({
      eventType: EventType.BREAKUP,
      source: EventSource.ROBOT,
      params: {
        sessionId: session.id,
        machineSerial: machine.serial,
      },
    });
    this.workerClient.stopIdleTimeout(session.id, data.correlationId);
    await this.workerClient.stopGraceTimeout(session.id, data.correlationId);

    const duration = moment().diff(session.createDate, 'seconds');
    this.playerPublisher.notifySessionResult(session.id, {
      totalWin: toCash(session.totalWinning, session.currencyConversionRate),
      currency: session.currency,
      duration,
    });
    const terminate = session.status === SessionStatus.TERMINATING;
    await this.sessionService.finalizeSession(session.id, terminate,
      terminate ? SessionEndReason.FORCED_TERMINATION : SessionEndReason.NORMAL);
    await this.queueManager.notifyQueueUpdate(queue.id);
    await this.seeding(machine.serial);
  }

  public async handleOutOfChips(serial: string): Promise<void> {
    await this.machineRepo
      .update({ serial }, {
        status: MachineStatus.SHUTTING_DOWN,
        shutdownReason: ShutdownReason.ERROR,
      });
    await this.robotClientService.sendStopMessage(serial);
    await this.monitoringClient.sendOutOfSessionEventLogMessage(serial, {
      eventType: EventType.STOPPING,
      source: EventSource.GAME,
      params: {},
    });
  }

  private async validateChipPush(chip: ChipEntity, machine: MachineEntity, group: GroupEntity): Promise<boolean> {
    if (!chip) {
      return false;
    }
    const config = await this.configValidator.getValidatedConfig(machine.serial);
    const chipPrize = await this.rngChipPrizeRepo
      .getChipPrize(group.prizeGroup, chip.type.id, config.rtpSegment);
    if (!chipPrize) {
      this.logger.error(`Chip prize not found, group=${group.id}, chipType=${chip.type.id}, segment=${config.rtpSegment}`);
      return false;
    }
    return !chip.machine && chip.site.id === machine.site.id;
  }

  public async handleChipValidation(serial: string, rfid: string): Promise<void> {
    const [machine, chip] = await Promise.all([
      this.machineRepo.findOneOrFail({ serial },
        { relations: ['group', 'site'] }),
      this.chipRepo.findOne({ rfid },
        { relations: ['type', 'machine', 'site'] }),
    ]);
    const isValid = await this.validateChipPush(chip, machine, machine.group);
    if (!isValid) {
      await this.monitoringClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Invalid chip detected',
        additionalInformation: {
          chip,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
    }
    await this.robotClientService.sendChipValidationMessage(rfid, isValid, machine.serial);
  }

  public async handleChipPushed(machineSerial: string, rfid: string, pending: number, correlationId?: string): Promise<void> {
    const [machine, chip] = await Promise.all([
      this.machineRepo.findOneOrFail({ serial: machineSerial },
        { relations: ['queue', 'dispensers', 'dispensers.chipType', 'group'] }),
      this.chipRepo.findOneOrFail({ rfid },
        { relations: ['type'] }),
    ]);
    const config = await this.configValidator.getValidatedConfig(machineSerial);
    await this.monitoringClient.sendEventLogMessage({
      eventType: EventType.CHIP_ADDED,
      source: EventSource.ROBOT,
      params: {
        rfid,
        type: chip.type.name,
        machineSerial,
        machineId: machine.id,
        groupId: machine.group.id,
      },
    });
    if (chip.type.name === PHANTOM_CHIP_TYPE_NAME) {
      const phantomSeed = await this.rngClient.phantom(machine.group.prizeGroup, config.rtpSegment)
        .catch(reason => {
          // todo: Can we set the chip to some reasonable default values to avoid hard stopping?
          this.monitoringClient.sendAlertMessage({
            alertType: AlertType.CRITICAL,
            severity: AlertSeverity.HIGH,
            source: AlertSource.GAME_CORE,
            description: 'Rng phantom call failed',
            additionalInformation: {
              rfid,
              correlationId,
              machineId: machine.id,
              machineName: machine.name,
              machineSerial,
            },
          });
          throw reason;
        });
      await this.chipRepo.update(chip.rfid, {
        machine,
        value: phantomSeed.value,
        isScatter: phantomSeed.type === 'scatter',
      });
    } else {
      const chipPrize = await this.rngChipPrizeRepo
        .getChipPrize(machine.group.prizeGroup, chip.type.id, config.rtpSegment);
      await this.chipRepo.update(chip.rfid,
        { machine, value: chipPrize.chipValue, isScatter: false });
    }
    const chipLevel = machine.dispensers.reduce((accum, current) => {
      if (current.chipType.id === chip.type.id) {
        // eslint-disable-next-line no-param-reassign
        accum += current.level;
      }
      return accum;
    }, 0);
    if (chipLevel === 0) {
      const disp = machine.dispensers
        .filter(value => value.chipType.id === chip.type.id)
        .sort((a, b) => a.level - b.level)[0];
      this.logger.warn(`Empty dispenser detected - dispenser: ${disp?.name}, chipType: ${chip.type.name}, serial: ${machineSerial}`);
      // fixme: uncomment when dispenser levels are stable
      /* await this.machineRepo.update(machine.id, {status: MachineStatus.SHUTTING_DOWN});
      await this.robotClientService.sendStopMessage(machine.serial); */
      await this.monitoringClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Dispenser is empty',
        additionalInformation: {
          maintenanceRequired: true,
          maintenanceType: MaintenanceType.FILL_DISPENSER,
          chipType: chip.type.name,
          dispenserName: disp?.name,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      return;
    }
    const dispenser = machine.dispensers
      .find(value => value.chipType.id === chip.type.id && value.level > 0);
    await this.dispenserRepo.decrement({ id: dispenser.id }, 'level', 1);
    if (chipLevel < 10) {
      await this.monitoringClient.sendAlertMessage({
        alertType: AlertType.WARNING,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Dispenser is almost empty',
        additionalInformation: {
          maintenanceRequired: true,
          maintenanceType: MaintenanceType.FILL_DISPENSER,
          chipType: chip.type.name,
          dispenserName: dispenser.name,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
    }
  }

  public async handleChipRemoved(rfid: string, machineSerial: string): Promise<void> {
    this.logger.log(`Chip removed: rfid=${rfid}, machineSerial=${machineSerial}`);
    const machine = await this.machineRepo.findOne({ serial: machineSerial });
    await this.monitoringClient.sendAlertMessage({
      alertType: AlertType.INFORMATION,
      severity: AlertSeverity.LOW,
      source: AlertSource.GAME_CORE,
      description: 'Chip removed',
      additionalInformation: {
        rfid,
        machineId: machine.id,
        machineName: machine.name,
        machineSerial,
      },
    });
  }

  public async engageNextSession(
    machineId: number,
    reBuySessionId?: number,
    correlationId: string = uuidv4(),
  ): Promise<void> {
    const machine = await this.machineRepo.getMachineToEngage(machineId);
    if (!machine) {
      throw new RpcException(`Machine not found, cant engage: machineId=${machineId}`);
    }
    const { queue, group } = machine;
    const nextSession = await this.sessionRepo.getNextSessionForQueue(queue.id);
    if (!nextSession) {
      if (machine.status !== MachineStatus.READY) {
        await this.machineRepo.update(machine.id, { status: MachineStatus.READY });
      }
      await this.queueManager.notifyQueueUpdate(queue.id, nextSession);
      return;
    }

    if (!this.canEngageNewSession(machine, nextSession, reBuySessionId)) {
      this.logger.warn(`Can not engage new session: ${JSON.stringify(
        {
          machineSerial: machine.serial,
          machineStatus: machine.status,
          queueStatus: queue.status,
          nextSessionId: nextSession.id,
          reBuySessionId: `${reBuySessionId || 'none'}`,
        })}`);
      return;
    }

    nextSession.machine = machine;

    // do not engage empty sessions
    if (nextSession.roundsLeft < 1) {
      this.logger.warn('Session with no rounds left');
      return;
    }

    // disable bb if was enabled
    if (nextSession.status === SessionStatus.QUEUE_BET_BEHIND) {
      nextSession.status = SessionStatus.QUEUE;
      await this.sessionRepo.update(nextSession.id, { status: SessionStatus.QUEUE },
        data => this.playerPublisher.sessionState(nextSession.id, { status: data.status }));
      await this.sessionDataManager.removeSessionData({ betBehind: {} as any }, nextSession.id);
    }
    const { player, operator, vouchers } = nextSession;
    const pendingVoucher = vouchers?.find(({ status }) => status === VoucherStatus.PENDING);
    const ctx: RoundContext = new RoundContext(nextSession, queue, machine, player, group, operator,
      false, pendingVoucher, correlationId);
    let round: RoundEntity;
    try {
      round = await this.roundServiceFactory.create(ctx)
        .startRound(pendingVoucher ? RoundType.VOUCHER : RoundType.REGULAR);
    } catch (err) {
      this.logger.error('Bet call failed during round start:'
        + ` SessionId=${nextSession.id}, correlationId=${correlationId}`, err.stack);
      this.notifyRoundStartError(nextSession, machine);
      await this.sessionService.finalizeSession(nextSession.id, true, SessionEndReason.WALLET_TRANSACTION_ERROR);
      this.eventPublisher.engageNextSession({
        type: BusEventType.ENGAGE_SESSION,
        machineId,
      }, correlationId);
      return;
    }
    if (nextSession.status === SessionStatus.RE_BUY) {
      await this.sessionRepo.update(nextSession.id, { status: SessionStatus.PLAYING },
        data => this.playerPublisher.sessionState(nextSession.id, { status: data.status }));
      await this.robotClientService.sendAllowCoinsMessage(round.coins, machine.serial, nextSession.id);
      await this.workerClient.startIdleTimeout(nextSession.id, correlationId);
      await this.monitoringClient.sendEventLogMessage({
        eventType: EventType.ALLOW,
        source: EventSource.GAME,
        params: {
          coins: round.coins,
          sessionId: nextSession.id,
          machineSerial: machine.serial,
        },
      });
    } else {
      await this.robotClientService.sendEngageMessage(nextSession.id, machine.serial);
      await this.workerClient.startEngageTimeout(nextSession.id, correlationId);
      await this.monitoringClient.sendEventLogMessage({
        eventType: EventType.ENGAGE_ROBOT,
        source: EventSource.GAME,
        params: {
          sessionId: nextSession.id,
          machineSerial: machine.serial,
        },
      });
    }
  }

  private canEngageNewSession(
    machine: MachineEntity, nextSession: SessionEntity, reBuySessionId?: number,
  ): boolean {
    if (machine.status !== MachineStatus.READY) {
      if (machine.status === MachineStatus.IN_PLAY && reBuySessionId) {
        return Number(nextSession.id) === Number(reBuySessionId);
      }
      return false;
    }
    return true;
  }

  private notifyRoundStartError(session: SessionEntity, machine: MachineEntity): void {
    this.monitoringClient.sendAlertMessage({
      alertType: AlertType.WARNING,
      severity: AlertSeverity.HIGH,
      source: AlertSource.GAME_CORE,
      description: 'Bet call failed during round start',
      additionalInformation: {
        sessionId: session.id,
        machineId: machine.id,
        machineName: machine.name,
        machineSerial: machine.serial,
      },
    });
    this.playerPublisher.sendNotification(session.id,
      {
        notificationId: NotificationType.BET_FAILED,
        title: 'Wallet error',
        message: 'Bet failed',
      });
  }

  public async reassignMachine(machineId: number): Promise<void> {
    const machine = await this.machineRepo.findOneOrFail(machineId,
      { relations: ['chips', 'chips.type', 'queue'] });
    if (!machine.reassignTo) {
      throw new NotAcceptableException('No reassign target');
    }
    const toGroup = await this.groupRepo.findOneOrFail(machine.reassignTo);
    const rngChipPrizes = await this.rngChipPrizeRepo
      .getAllPrizes(toGroup.prizeGroup, toGroup.configuration.rtpSegment);
    const targetTypeMap = new Map<number, number>(rngChipPrizes
      .map(prize => [prize.chipType.id, prize.chipValue]));
    if (!machine.chips.every(chip => targetTypeMap.has(chip.type.id))) {
      await this.monitoringClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Machine reassign failed. Incompatible target group',
        additionalInformation: {
          groupId: toGroup.id,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      this.logger.error('Machine switch failed. Incompatible target group!');
      throw new NotAcceptableException('Machine reassign failed. Incompatible target group');
    }
    await getManager(connectionNames.DATA).transaction(async entityManager => {
      const chipRepo = entityManager.getCustomRepository(ChipRepository);
      try {
        await zip(from(machine.chips), interval(100))
          .pipe(
            mergeMap(async ([chip]) => {
              if (chip.type.name !== PHANTOM_CHIP_TYPE_NAME) {
                await chipRepo.update(chip.rfid, { value: targetTypeMap.get(chip.type.id) });
              } else {
                const phantomSeed = await this.rngClient
                  // todo: double check that /phantom endpoint works without rtpSegment param
                  .phantom(toGroup.prizeGroup, toGroup.configuration.rtpSegment || null);
                await chipRepo.update(chip.rfid,
                  { value: phantomSeed.value, isScatter: phantomSeed.type === 'scatter' });
              }
              return chip.rfid;
            }), toArray())
          .toPromise();
      } catch (err) {
        await this.monitoringClient.sendAlertMessage({
          alertType: AlertType.CRITICAL,
          severity: AlertSeverity.HIGH,
          source: AlertSource.GAME_CORE,
          description: 'Chips update during reassign failed',
          additionalInformation: {
            groupId: toGroup.id,
            machineId: machine.id,
            machineName: machine.name,
            machineSerial: machine.serial,
          },
        });
        this.logger.error(`Chips update during reassign failed. MachineId=${machine.id}`);
        await this.robotClientService.sendStopMessage(machine.serial);
        throw err;
      }
      const machineRepo = entityManager.getCustomRepository(MachineRepository);
      machine.configuration.rtpSegment = toGroup.configuration.rtpSegment;
      await machineRepo.update(machine.id,
        {
          group: toGroup,
          configuration: machine.configuration,
          status: MachineStatus.SEEDING,
          reassignTo: null,
        });
      await entityManager.getCustomRepository(QueueRepository)
        .update(machine.queue.id, { status: QueueStatus.READY });
    });
    await this.configValidator.dropCache(machine.serial);
    await this.seeding(machine.serial); // seed machine using new group settings
    await this.monitoringClient.sendAlertMessage({
      alertType: AlertType.INFORMATION,
      severity: AlertSeverity.LOW,
      source: AlertSource.GAME_CORE,
      description: 'Machine reassign complete',
      additionalInformation: {
        machineId: machine.id,
        machineName: machine.name,
        machineSerial: machine.serial,
        toGroupId: toGroup.id,
        toGroupName: toGroup.name,
      },
    });
  }

  public async seeding(machineSerial: string): Promise<void> {
    const machine = await this.machineRepo.findOneOrFail({ serial: machineSerial },
      { relations: ['group', 'queue', 'chips', 'chips.type', 'site', 'dispensers', 'dispensers.chipType'] });
    if (machine.queue.status === QueueStatus.DRYING) {
      const { queue } = machine;
      const toKick = await this.sessionRepo.find({ queue: { id: queue.id } });
      if (toKick?.length) {
        toKick.forEach(session => this.eventPublisher.queueChange({
          type: BusEventType.CHANGE_QUEUE,
          sessionId: session.id,
          ignoreMachines: [machine.id],
        }));
      }
      if (machine.reassignTo) {
        await this.reassignMachine(machine.id);
      } else {
        await this.queueRepo.update(queue.id, { status: QueueStatus.STOPPED });
        await this.machineRepo.update(machine.id, {
          status: MachineStatus.SHUTTING_DOWN,
          shutdownReason: ShutdownReason.USER_REQUEST,
        });
        await this.robotClientService.sendStopMessage(machine.serial);
      }
      return;
    }
    await this.machineRepo.update(machine.id, { status: MachineStatus.SEEDING });
    const { group, chips } = machine;
    const config = await this.configValidator.getValidatedConfig(machineSerial);
    const chipsToPush = await this.rngClient
      .seed(group.prizeGroup, config.minimalHold.value, config.minimalHold.count,
        config.rtpSegment, chips)
      .catch(reason => {
        this.monitoringClient.sendAlertMessage({
          alertType: AlertType.CRITICAL,
          severity: AlertSeverity.HIGH,
          source: AlertSource.GAME_CORE,
          description: 'RNG seed failed',
          additionalInformation: {
            groupId: group.id,
            machineId: machine.id,
            machineName: machine.name,
            machineSerial: machine.serial,
          },
        });
        throw reason;
      });
    this.logger.log(`RNG "seed" result: ${JSON.stringify(chipsToPush)}, machineSerial: ${machineSerial}`);
    if (Object.keys(chipsToPush).length) {
      const history = this.seedHistoryRepo.create(
        {
          machineId: machine.id,
          seed: chipsToPush,
        });
      await this.seedHistoryRepo.save(history, { reload: false, transaction: false });
    } else {
      await this.machineRepo.update(machine.id, { status: MachineStatus.READY });
      this.eventPublisher.engageNextSession({
        type: BusEventType.ENGAGE_SESSION,
        machineId: machine.id,
      });
      return;
    }
    const dispenserTypeToNameMap = new Map(machine.dispensers
      .map(dispenser => [dispenser.chipType.name, dispenser.name]));
    const dispensersToPush = await from(Object.entries(chipsToPush))
      .pipe(
        concatMap(([type, count]) => {
          const dispenserName = dispenserTypeToNameMap.get(type);
          if (dispenserName) {
            return of(dispenserName).pipe(repeat(count));
          }
          return EMPTY;
        }),
        toArray(),
      ).toPromise();
    const reshuffleCoins = chips?.length ? config.reshuffleCoinsNonEmpty : config.reshuffleCoinsEmpty;
    await this.robotClientService.sendSeedMessage(machineSerial, dispensersToPush, reshuffleCoins);
    await this.monitoringClient.sendOutOfSessionEventLogMessage(machineSerial, {
      source: EventSource.GAME,
      eventType: EventType.SEED,
      params: {
        serial: machine.serial,
        toPush: dispensersToPush,
        reshuffleCoins,
      },
    });
  }

  public async handleTable(serial: string, table: string[]): Promise<void> {
    this.logger.log(`Table state: rfids=${JSON.stringify(table)}, machine serial=${serial}`);
    // todo: further logs improvement
  }

  public async handlePong(serial: string): Promise<void> {
    await this.machineRepo.update({ serial }, { pingDate: new Date() });
  }

  public async handlePosition(data: RobotPositionDto): Promise<void> {
    await this.monitoringClient.sendEventLogMessage({
      eventType: EventType.MOVE,
      source: EventSource.ROBOT,
      params: {
        angle: data.angle,
        machineSerial: data.serial,
        sessionId: data.sessionId,
      },
    });
  }

  public async handlePingOutdated(serial: string, correlationId?: string): Promise<void> {
    try {
      const machine = await this.machineRepo.findOneOrFail({ serial },
        { relations: ['group'] });
      await this.monitoringClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        severity: AlertSeverity.HIGH,
        source: AlertSource.GAME_CORE,
        description: 'Machine not responding',
        additionalInformation: {
          correlationId,
          machineId: machine.id,
          machineName: machine.name,
          machineSerial: machine.serial,
        },
      });
      await this.groupTerminator
        .groupHardStop(machine.group.id, [machine.id], correlationId);
      await this.machineRepo.update(machine.id, { status: MachineStatus.OFFLINE });
    } catch (err) {
      throw new RpcException(err);
    }
  }
}

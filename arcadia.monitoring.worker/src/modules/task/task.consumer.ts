/* eslint-disable max-lines */
import { InjectQueue } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AlertEntity,
  AlertRepository,
  AlertSeverity,
  AlertStatus,
  AlertType,
  ChipEntity,
  ChipRepository,
  connectionNames,
  In,
  InjectRepository,
  MachineRepository,
  MachineStatus,
  Not,
  PerformanceIndicatorDimension,
  PerformanceIndicatorEntity,
  PerformanceIndicatorMetric,
  PerformanceIndicatorMode,
  PerformanceIndicatorRepository,
  PerformanceIndicatorSegment,
  PerformanceIndicatorStatus,
  PerformanceTrackerEntity,
  PerformanceTrackerRepository,
  QueueRepository,
  Raw,
  RoundArchiveEntity,
  RoundRepository,
  SessionArchiveEntity,
  SessionEntity,
  SessionRepository,
  SessionStatus,
  ViolatedThreshold,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import { Job, Queue } from 'bull';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ServerRMQ } from '../../rabbitMQ.strategy';
import { groupPushDropByRfid } from '../../util';
import { EventType, RobotEventType } from '../coreClient/enum';
import { BullQueues } from '../enum/bull.queues';
import { AppLogger } from '../logger/logger.service';
import { EventLog, RobotEventLog } from '../schemas';
import { AlertData } from './task.interface';
import { CoreClientService } from '../coreClient/coreClient.service';

export class TaskConsumer implements OnModuleInit {
  private serverRmq: ServerRMQ;

  constructor(
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepository: SessionRepository,
    @InjectRepository(PerformanceTrackerRepository, connectionNames.DATA)
    private readonly performanceTrackerRepository: PerformanceTrackerRepository,
    @InjectRepository(PerformanceIndicatorRepository, connectionNames.DATA)
    private readonly performanceIndicatorRepository: PerformanceIndicatorRepository,
    @InjectRepository(RoundRepository, connectionNames.DATA)
    private readonly roundRepository: RoundRepository,
    @InjectRepository(AlertRepository, connectionNames.DATA)
    private readonly alertRepository: AlertRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepository: ChipRepository,
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepository: QueueRepository,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepository: MachineRepository,
    @InjectQueue(BullQueues.KPI_TASK) private readonly kpiTaskQueue: Queue,
    private readonly logger: AppLogger,
    @InjectModel(EventLog.name) private readonly eventLogModel: Model<EventLog>,
    @InjectModel(RobotEventLog.name) private readonly robotEventLogModel: Model<RobotEventLog>,
    private readonly coreClient: CoreClientService,
  ) {
  }

  onModuleInit() {
    this.serverRmq = ServerRMQ.getInstance();
    this.kpiTaskQueue.process('*', 10, this.kpiTask.bind(this));
  }

  private async kpiTask(job: Job<Record<string, any>>): Promise<void> {
    this.logTask(BullQueues.KPI_TASK, job.data);

    try {
      const performanceIndicators = await this.performanceIndicatorRepository.find({
        where: { status: PerformanceIndicatorStatus.ACTIVE, isDeleted: false },
        relations: ['metric', 'dimension'],
      });

      await from(performanceIndicators).pipe(concatMap(async i => {
        this.logger.log(`Calculating ${i.metric.name} KPI, indicator id ${i.id}`);
        switch (i.metric.name) {
          case PerformanceIndicatorMetric.EDGE:
            await this.calculateEdgeMetric(i);
            break;
          case PerformanceIndicatorMetric.WINS:
            await this.calculateWinsMetric(i);
            break;
          case PerformanceIndicatorMetric.CHIP_PUSHES:
            await this.calculateChipPushesMetric(i);
            break;
          case PerformanceIndicatorMetric.ROUND_DURATION:
            await this.calculateRoundDurationMetric(i);
            break;
          case PerformanceIndicatorMetric.SESSION_DURATION:
            await this.calculateSessionDurationMetric(i);
            break;
          case PerformanceIndicatorMetric.QUEUE_LENGTH:
            await this.calculateQueueLengthMetric(i);
            break;
         case PerformanceIndicatorMetric.UP_PLAYING_TIME:
            await this.calculateUpPlayingTimeMetric(i);
            break;
          case PerformanceIndicatorMetric.SYSTEM_DISCONNECTS:
            await this.calculateSystemDisconnectsMetric(i);
            break;
          case PerformanceIndicatorMetric.IDLE_DISCONNECTS:
            await this.calculateIdleDisconnectsMetric(i);
            break;
          case PerformanceIndicatorMetric.POPULATION:
            await this.calculatePopulationMetric(i);
            break;
          case PerformanceIndicatorMetric.HOLD:
            await this.calculateHoldMetric(i);
            break;
          case PerformanceIndicatorMetric.CHIP_STAY:
            await this.calculateChipStayMetric(i);
            break;
          case PerformanceIndicatorMetric.ILLEGAL_CHIP_DROPS:
            await this.calculateIllegalChipDropsMetric(i);
            break;
          case PerformanceIndicatorMetric.JACKPOT_WON:
            await this.calculateJackpotWonMetric(i);
            break;
          case PerformanceIndicatorMetric.HARDWARE_FAULTS:
            await this.calculateHardwareFaultsMetric(i);
            break;
          case PerformanceIndicatorMetric.ARM_SWINGS:
            await this.calculateArmSwingsMetric(i);
            break;
          case PerformanceIndicatorMetric.PHANTOM_VALUE_VARIATION:
            await this.calculatePhantomValueVariationMetric(i);
            break;
          case PerformanceIndicatorMetric.OPERATOR_LATENCY:
            await this.calculateOperatorLatencyMetric(i);
            break;
          default:
            this.logger.warn(`Unsupported metric ${i.metric}`);
            break;
        }

        return true;
      })).toPromise();
      // TODO: Run as bull jobs
    } catch (e) {
      this.logTaskError(BullQueues.KPI_TASK, e);
    }
  }

  private async getEventLogsBySegmentAndDimension(indicator: PerformanceIndicatorEntity, type: EventType): Promise<EventLog[]> {
    const query: any = { type };
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      const lastRounds = await this.roundRepository.getRoundsBySegment(indicator, indicator.dimension.value, true);
      query['parameters.round'] = { $in: (lastRounds as RoundArchiveEntity[]).map(r => r.id) };
    } else {
      const lastMinutesDate = moment().subtract(indicator.dimension.value, 'minute').valueOf();
      query.createdDate = { $gte: lastMinutesDate };
    }

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          query['parameters.groupId'] = indicator.subSegment.group;
        }
        break;
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          query['parameters.machineId'] = indicator.subSegment.machine;
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          query['parameters.operatorId'] = indicator.subSegment.operator;
        }
        break;
      default:
        break;
    }

    return this.eventLogModel.find(query);
  }

  private async getHardwareFaultsBySegmentAndDimension(indicator: PerformanceIndicatorEntity): Promise<RobotEventLog[]> {
    const query: any = { type: RobotEventType.ROBOT_ERROR };
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.MINUTE) {
      const lastMinutesDate = moment().subtract(indicator.dimension.value, 'minute').unix();
      query.createdDate = { $gte: lastMinutesDate };
    }

    const segmentSessions = ((await Promise.all([
      this.sessionRepository.getSessionsBySegmentAndDimension(indicator, indicator.dimension),
      this.sessionRepository.getSessionsBySegmentAndDimension(indicator, indicator.dimension, true),
    ])) as any).flat();

    query.sessionId = { $in: (segmentSessions as SessionEntity[]).map(s => s.id) };

    return this.robotEventLogModel.find(query);
  }

  private static checkViolatedThreshold(indicator: PerformanceIndicatorEntity, diff: BigNumber): ViolatedThreshold {
    if (indicator.cutoffHighThreshold && diff.gt(indicator.cutoffHighThreshold)) {
      return ViolatedThreshold.CUTOFF_HIGH;
    }
    if (indicator.alertHighThreshold && diff.gt(indicator.alertHighThreshold)) {
      return ViolatedThreshold.ALERT_HIGH;
    }
    if (indicator.cutoffLowThreshold && diff.lt(indicator.cutoffLowThreshold)) {
      return ViolatedThreshold.CUTOFF_LOW;
    }
    if (indicator.alertLowThreshold && diff.lt(indicator.alertLowThreshold)) {
      return ViolatedThreshold.ALERT_LOW;
    }

    return null;
  }

  private static createTracker(indicator: PerformanceIndicatorEntity, violatedThreshold: ViolatedThreshold, value: number, subsegmentItem?: string): PerformanceTrackerEntity {
    const tracker = new PerformanceTrackerEntity();
    tracker.violatedThreshold = violatedThreshold;
    tracker.performanceIndicator = indicator;
    tracker.value = value;
    tracker.subsegmentItem = subsegmentItem || 'ALL';
    return tracker;
  }

  private async saveTrackers(performanceTrackers: PerformanceTrackerEntity[]): Promise<void> {
    const existingTrackers = await this.performanceTrackerRepository.find({
      where:
          { indicatorId: In(performanceTrackers.map(t => t.performanceIndicator.id)), subsegmentItem: In(performanceTrackers.map(t => t.subsegmentItem)) },
      relations: ['performanceIndicator'],
    });
    const trackers = performanceTrackers.reduce((acc, t) => {
      const existingTracker = existingTrackers.find(et => et.performanceIndicator.id === t.performanceIndicator.id && et.subsegmentItem === t.subsegmentItem);
      if (existingTracker) {
        existingTracker.violatedThreshold = t.violatedThreshold;
        existingTracker.value = t.value;
        acc.push(existingTracker);
      } else {
        acc.push(t);
      }

      return acc;
    }, []);

    await this.performanceTrackerRepository.save(trackers);
  }

  private async createAlerts(alertsData: AlertData[]): Promise<void> {
    const existingAlerts = await this.alertRepository.find({
      where:
        { status: AlertStatus.ACTIVE, additionalInformation: Raw(info => `JSON_EXTRACT(${info}, "$.indicatorId") IN (:ids)`, { ids: alertsData.map(a => a.indicator.id) }) },
    });
    const alerts = alertsData.map(a => {
      const existingAlert = existingAlerts.find(ea => ea.additionalInformation.indicatorId === a.indicator.id);
      if (existingAlert) {
        return null;
      }
      const alert = new AlertEntity();
      alert.severity = AlertSeverity.MEDIUM;
      alert.description = a.description;
      alert.additionalInformation = {
        violatedThreshold: a.violatedThreshold,
        indicatorId: a.indicator.id,
        metric: a.indicator.metric.name,
        segment: a.indicator.segment,
        subsegment: a.indicator.mode === PerformanceIndicatorMode.ALL ? a.indicator.subSegment : { machine: a.machineId },
        attribution: a.indicator.mode,
        dimensionId: a.indicator.dimension.id,
        dimensionName: a.indicator.dimension.name,
        value: a.currentValue,
        machineSerial: a.machineSerial,
      };
      alert.source = 'Game';
      alert.type = AlertType.ALERT;

      return alert;
    });

    await this.alertRepository.save(alerts.filter(a => a));
  }

  private async cutoffMachines(machineSerials: string[]): Promise<void> {
    if (!machineSerials.length) {
      return;
    }
    const machines = await this.machineRepository.createQueryBuilder('m')
      .leftJoin('m.group', 'group')
      .select('m.id')
      .addSelect('m.serial')
      .addSelect('group.id')
      .where({ serial: In(machineSerials), status: Not(In([MachineStatus.OFFLINE, MachineStatus.STOPPED, MachineStatus.SHUTTING_DOWN])) })
      .getMany();
    const machinesByGroup = _.groupBy(machines, m => m.group.id);
    const correlationId = uuidv4();
    this.logger.log(`Sending stop for machines ${JSON.stringify(machines.map(m => m.serial))}, correlation ${correlationId}`);

    /* await from(Object.entries(machinesByGroup)).pipe(
      concatMap(async ([groupId, machines]) => { await this.coreClient.groupHardStop(Number(groupId), correlationId, machines.map(m => m.id)); }),
      toArray(),
    ).toPromise(); */
    // TODO: enable when ready
  }

  private async getMachineSerialsBySegment(indicator: PerformanceIndicatorEntity): Promise<string[]> {
    const machineSerialQuery = this.machineRepository.createQueryBuilder('m').select('m.serial')
      .leftJoin('m.group', 'g')
      .leftJoin('g.operators', 'op')
      .where('m.is_deleted = 0');

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          machineSerialQuery.andWhere('m.id = :id', { id: indicator.subSegment.machine });
        }
        break;
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          machineSerialQuery.andWhere('g.id = :id', { id: indicator.subSegment.group });
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          machineSerialQuery.andWhere('op.id = :id', { id: indicator.subSegment.operator });
        }
        break;
      default:
        break;
    }

    const result = await machineSerialQuery.getMany();
    return result.map(m => m.serial);
  }

  private async populateGroupedEntitiesWithSerials<T>(indicator: PerformanceIndicatorEntity, entities: _.Dictionary<T[]>): Promise<_.Dictionary<T[]>> {
    const allSegmentMachines = await this.getMachineSerialsBySegment(indicator);
    const machinesWithNoRounds = _.difference(allSegmentMachines, Object.keys(entities));
    machinesWithNoRounds.forEach(serial => entities[serial] = []);

    return entities;
  }

  private async calculateEdgeMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating edge metric');
    const roundsGrouppedUnpopulated = _.groupBy(await this.roundRepository.getRoundsBySegmentAndDimension(indicator, indicator.dimension),
      (r => r.session?.machine?.serial));
    const roundsGroupped = await this.populateGroupedEntitiesWithSerials(indicator, roundsGrouppedUnpopulated);

    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      const allSegmentMachines = await this.getMachineSerialsBySegment(indicator);
      const machinesWithNoRounds = _.difference(allSegmentMachines, Object.keys(roundsGroupped));
      machinesWithNoRounds.forEach(serial => roundsGroupped[serial] = []);
      Object.entries(roundsGroupped).forEach(([machineSerial, rounds]) => {
        let betsTotal = new BigNumber(0);
        let payoutsTotal = new BigNumber(0);
        for (const r of rounds) {
          betsTotal = betsTotal.plus(r.bet);
          payoutsTotal = payoutsTotal.plus(r.wins);
        }
        const diff = betsTotal.minus(payoutsTotal);
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, diff);
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, diff.toNumber(), machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: 'Edge KPI violation',
            violatedThreshold,
            indicator,
            currentValue: diff.toNumber(),
            machineSerial,
            machineId: rounds[0].session?.machine?.id,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      let betsTotal = new BigNumber(0);
      let payoutsTotal = new BigNumber(0);
      Object.entries(roundsGroupped).forEach(([, rounds]) => {
        for (const r of rounds) {
          betsTotal = betsTotal.plus(r.bet);
          payoutsTotal = payoutsTotal.plus(r.wins);
        }
      });
      const diff = betsTotal.minus(payoutsTotal).div(Object.entries(roundsGroupped).length);
      if (diff.isNaN()) {
        this.logger.warn(`Edge KPI calculation NaN detected, rounds data: ${JSON.stringify(roundsGroupped)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, diff);
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, diff.dp(2).toNumber()));
      if (violatedThreshold) {
        alerts.push({
          description: 'Edge KPI violation', violatedThreshold, indicator, currentValue: diff,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(roundsGroupped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length > 0) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateWinsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating wins metric');
    const eventsGroupedUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.CHIP_DROP),
      (e => e.parameters.machineSerial));
    const eventsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, eventsGroupedUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, eventsGrouped, 'Wins KPI violation');
  }

  private async calculateQueueLengthMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating queue length metric');
    const machines = await this.machineRepository.find({ where: { serial: In(await this.getMachineSerialsBySegment(indicator)) }, relations: ['queue'] } );
    const queueIds = machines.map(m => m.queue.id);
    const queueLengths = await this.queueRepository.getQueueLengthsKpi(queueIds);

    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      for (const queue of queueLengths) {
        const machine = machines.find(m => m.queue.id === queue.id);
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(queue.length));
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, queue.length, machine.serial));

        if (violatedThreshold) {
          alerts.push({
            description: `Queue ${queue.id} length KPI violation`,
            violatedThreshold,
            indicator,
            currentValue: queue.length,
            machineSerial: machine.serial,
            machineId: machine.id,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machine.serial);
          }
        }
      }
    } else {
      const totalLength = queueLengths.reduce((acc, record) => acc + record.length, 0);
      const avgLength = new BigNumber(totalLength).div(machines.length);
      if (avgLength.isNaN()) {
        this.logger.warn(`Queue length KPI NaN calculated, machines data: ${JSON.stringify(machines)}`);
        return;
      }

      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgLength);
      const currentValue = avgLength.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));

      if (violatedThreshold) {
        alerts.push({
          description: 'Queue length KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(machines.map(m => m.serial));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length > 0) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateRoundDurationMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating round duration metric');
    const roundsGroupedUnpopulated = _.groupBy(await this.roundRepository.getRoundsBySegmentAndDimension(indicator, indicator.dimension),
      (r => r.session.machine.serial));
    const roundsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, roundsGroupedUnpopulated);

    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(roundsGrouped).forEach(([machineSerial, rounds]) => {
        const roundDurations: any = {};
        for (const r of rounds) {
          roundDurations[r.id] = moment().diff(r.createDate, 'seconds');
        }
        for (const round in roundDurations) {
          if (roundDurations[round]) {
            const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(roundDurations[round]));
            trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, roundDurations[round], machineSerial));

            if (violatedThreshold) {
              alerts.push({
                description: `Round id ${round} duration KPI violation`,
                violatedThreshold,
                indicator,
                currentValue: roundDurations[round],
                machineSerial,
                machineId: rounds[0].session.machine.id,
              });
              if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
                cutoffs.push(machineSerial);
              }
            }
          }
        }
      });
    } else {
      let totalDuration = new BigNumber(0);
      let totalRounds = 0;
      Object.entries(roundsGrouped).forEach(([, rounds]) => {
        totalDuration = totalDuration.plus(rounds
          .reduce((acc, r) => acc.plus(moment().diff(r.createDate, 'seconds')), new BigNumber(0)));
        totalRounds += rounds.length;
      });

      const avgDuration = totalDuration.div(totalRounds);
      if (avgDuration.isNaN()) {
        this.logger.warn(`Round duration KPI NaN calculated, rounds data: ${JSON.stringify(roundsGrouped)}`);
        return;
      }

      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgDuration);
      const currentValue = avgDuration.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));

      if (violatedThreshold) {
        alerts.push({
          description: 'Round duration KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(roundsGrouped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length > 0) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateSessionDurationMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating session duration metric');
    const sessionsGroupedUnpopulated = _.groupBy(await this.sessionRepository.getSessionsBySegmentAndDimension(indicator, indicator.dimension),
      ((s: SessionEntity) => s.machine.serial));
    const sessionsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, sessionsGroupedUnpopulated);

    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(sessionsGrouped).forEach(([machineSerial, sessions]) => {
        const sessionDurations: any = {};
        for (const s of sessions as SessionEntity[]) {
          sessionDurations[s.id] = moment().diff(s.createDate, 'seconds');
        }
        for (const session in sessionDurations) {
          if (sessionDurations[session]) {
            const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(sessionDurations[session]));
            trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, sessionDurations[session], machineSerial));

            if (violatedThreshold) {
              alerts.push({
                description: `Session id ${session} duration KPI violation`,
                violatedThreshold,
                indicator,
                currentValue: sessionDurations[session],
                machineSerial,
                machineId: (sessions as SessionEntity[])[0].machine.id,
              });
              if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
                cutoffs.push(machineSerial);
              }
            }
          }
        }
      });
    } else {
      let totalDuration = new BigNumber(0);
      let totalSessions = 0;
      Object.entries(sessionsGrouped).forEach(([, sessions]) => {
        totalDuration = totalDuration.plus((sessions as SessionEntity[])
          .reduce((acc, s) => acc.plus(moment().diff(s.createDate, 'seconds')), new BigNumber(0)));
        totalSessions += sessions.length;
      });

      const avgDuration = totalDuration.div(totalSessions);
      if (avgDuration.isNaN()) {
        this.logger.warn(`Session duration KPI NaN calculated, sessions data: ${JSON.stringify(sessionsGrouped)}`);
        return;
      }

      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgDuration);
      const currentValue = avgDuration.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));

      if (violatedThreshold) {
        alerts.push({
          description: 'Session duration KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(sessionsGrouped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length > 0) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateUpPlayingTimeMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating up playing time metric');
    const sessionsGroupedUnpopulated = _.groupBy(await this.sessionRepository.getSessionsBySegmentAndDimension(indicator, indicator.dimension, true),
      ((s: SessionArchiveEntity) => s.machineSerial));
    const sessionsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, sessionsGroupedUnpopulated);
    const trackers: PerformanceTrackerEntity[] = [];
    const alerts = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(sessionsGrouped).forEach(([machineSerial, sessions]) => {
        sessions.forEach((s: SessionArchiveEntity) => {
          const idlePercentage = new BigNumber(s.viewerDuration).div(s.duration).multipliedBy(100).integerValue();
          const offlinePercentage = new BigNumber(s.offlineDuration).div(s.duration).multipliedBy(100).integerValue();
          const sessionTime = new BigNumber(100).minus(idlePercentage).minus(offlinePercentage);
          const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, sessionTime);
          trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, sessionTime.toNumber(), machineSerial));

          if (violatedThreshold) {
            alerts.push({
              description: `Session ${s.id} up playing time KPI violation`,
              violatedThreshold,
              indicator,
              currentValue: sessionTime.toNumber(),
              machineSerial,
              machineId: s.machineId,
            });
            if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
              cutoffs.push(machineSerial);
            }
          }
        });
      });
    } else {
      let totalSessionTime = new BigNumber(0);
      let totalSessions = 0;
      Object.entries(sessionsGrouped).forEach(([, sessions]) => {
        sessions.forEach((s: SessionArchiveEntity) => {
          const idlePercentage = new BigNumber(s.viewerDuration).div(s.duration).multipliedBy(100).integerValue();
          const offlinePercentage = new BigNumber(s.offlineDuration).div(s.duration).multipliedBy(100).integerValue();
          const sessionTime = new BigNumber(100).minus(idlePercentage).minus(offlinePercentage);
          totalSessionTime = totalSessionTime.plus(sessionTime);
          totalSessions += sessions.length;
        });
      });

      if (totalSessions === 0) {
        return;
      }

      const avgSessionTime = totalSessionTime.div(totalSessions);
      if (avgSessionTime.isNaN()) {
        this.logger.warn(`Up playing time KPI NaN calculated, sessions data: ${JSON.stringify(sessionsGrouped)}`);
        return;
      }

      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgSessionTime);
      const currentValue = avgSessionTime.toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));

      if (violatedThreshold) {
        alerts.push({
          description: 'Session up playing time KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(sessionsGrouped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length > 0) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateSystemDisconnectsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating system disconnects metric');
    const sessionsGroupedUnpopulated = _.groupBy(await this.sessionRepository.getSessionsBySegmentAndDimension(indicator, indicator.dimension, true),
      ((s: SessionArchiveEntity) => s.machineSerial));
    const sessionsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, sessionsGroupedUnpopulated);
    const trackers: PerformanceTrackerEntity[] = [];
    const alerts = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(sessionsGrouped).forEach(([machineSerial, sessions]) => {
        const systemDisconnects = (sessions as SessionArchiveEntity[]).reduce((acc, session) => (session.status === SessionStatus.TERMINATED ? acc + 1 : acc), 0);
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(systemDisconnects));
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, systemDisconnects, machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: 'System disconnects KPI violation',
            violatedThreshold,
            indicator,
            currentValue: systemDisconnects,
            machineSerial,
            machineId: (sessions as SessionArchiveEntity[])[0].machineId,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      const totalDisconnects = Object
        .entries(sessionsGrouped)
        .reduce((totalAcc, [, sessions]) => totalAcc
          .plus((sessions as SessionArchiveEntity[])
            .reduce((acc, session) => (session.status === SessionStatus.TERMINATED ? acc + 1 : acc), 0)), new BigNumber(0));
      const avgDisconnects = totalDisconnects.div(Object.entries(sessionsGrouped).length);
      if (totalDisconnects.isNaN()) {
        this.logger.warn(`System disconnects KPI NaN calculated, sessions data: ${JSON.stringify(sessionsGrouped)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgDisconnects);
      const currentValue = avgDisconnects.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: 'System disconnects KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(sessionsGrouped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateEventCountTypeMetric(
    indicator: PerformanceIndicatorEntity, eventsGrouped: _.Dictionary<EventLog[] | RobotEventLog[]>,
    alertText: string,
  ): Promise<void> {
    const alerts = [];
    const trackers = [];
    const cutoffs = [];
    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(eventsGrouped).forEach(([machineSerial, events]) => {
        const eventCount = events.length;
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(eventCount));
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, eventCount, machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: alertText,
            violatedThreshold,
            indicator,
            currentValue: eventCount,
            machineSerial,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      const eventCount = Object.entries(eventsGrouped).reduce((acc, [, events]) => acc + events.length, 0);
      const average = new BigNumber(eventCount).div(Object.entries(eventsGrouped).length);
      if (average.isNaN()) {
        this.logger.warn(`${indicator.metric.name} KPI NaN calculated, eventsData: ${JSON.stringify(eventsGrouped)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, average);
      const currentValue = average.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: alertText, violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(eventsGrouped));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateIdleDisconnectsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating idle disconnects metric');
    const disconnectEventsGroupedUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.IDLE_DISCONNECT),
      (e => e.parameters.machineSerial));
    const disconnectEventsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, disconnectEventsGroupedUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, disconnectEventsGrouped, 'Idle disconnects KPI violation');
  }

  private async calculateChipPushesMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating chip pushes metric');
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      this.logger.warn('Round dimension is not supported for chip pushes metric');
      return;
    }
    const chipPushesEventsGroupedUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.CHIP_ADDED),
      (e => e.parameters.machineSerial));
    const chipPushesEventsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, chipPushesEventsGroupedUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, chipPushesEventsGrouped, 'Chip pushes KPI violation');
  }

  private async calculatePopulationMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating population metric');
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      this.logger.warn('Round dimension is not supported for population metric');
      return;
    }
    const chips: _.Dictionary<ChipEntity[]> = await this.chipRepository.getActiveInPlayChipsBySegment(indicator);
    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(chips).forEach(([machineSerial, chips]) => {
        const chipsCount = chips.length;
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(chipsCount));
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, chipsCount, machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: 'Population KPI violation',
            violatedThreshold,
            indicator,
            currentValue: chipsCount,
            machineSerial,
            machineId: chips[0].machine.id,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      const totalPopulation = Object.entries(chips).reduce((acc, [, chips]) => acc.plus(chips.length), new BigNumber(0));
      const averagePopulation = totalPopulation.div(Object.entries(chips).length);
      if (averagePopulation.isNaN()) {
        this.logger.warn(`Population KPI NaN calculated, chips data: ${JSON.stringify(chips)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, averagePopulation);
      const currentValue = averagePopulation.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: 'Population KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(chips));
        }
      }
    }

    await this.saveTrackers(trackers);
    await this.createAlerts(alerts);
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateHoldMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating hold metric');
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      this.logger.warn('Round dimension is not supported for hold metric');
      return;
    }

    const chips: _.Dictionary<ChipEntity[]> = await this.chipRepository.getActiveInPlayChipsBySegment(indicator);
    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(chips).forEach(([machineSerial, chips]) => {
        const chipsValue = chips.reduce((acc, chip) => acc.plus(chip.value), new BigNumber(0));
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, chipsValue);
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, chipsValue.toNumber(), machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: 'Hold KPI violation',
            violatedThreshold,
            indicator,
            currentValue: chipsValue.toNumber(),
            machineSerial,
            machineId: chips[0].machine.id,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      const totalHold = Object.entries(chips)
        .reduce((acc, [, chips]) => acc
          .plus(chips.reduce((acc, chip) => acc.plus(chip.value), new BigNumber(0))), new BigNumber(0));
      const averageHold = totalHold.div(Object.entries(chips).length);
      if (averageHold.isNaN()) {
        this.logger.warn(`Hold KPI NaN calculated, chips data: ${JSON.stringify(chips)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, averageHold);
      const currentValue = averageHold.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: 'Hold KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(chips));
        }
      }
    }

    await this.saveTrackers(trackers);
    await this.createAlerts(alerts);
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateChipStayMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating chip stay metric');
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      this.logger.warn('Round dimension is not supported for chip stay metric');
      return;
    }
    const dropEvents = await this.getEventLogsBySegmentAndDimension(indicator, EventType.CHIP_DROP);
    const pushEvents = await this.getEventLogsBySegmentAndDimension(indicator, EventType.CHIP_ADDED);
    const dispenseEvents = await this.getEventLogsBySegmentAndDimension(indicator, EventType.COIN_DISPENSED);
    const groupedEventsUnpopulated = _.groupBy(groupPushDropByRfid(dropEvents, pushEvents), e => e.serial);
    const groupedEvents = await this.populateGroupedEntitiesWithSerials(indicator, groupedEventsUnpopulated);
    const trackers: PerformanceTrackerEntity[] = [];
    const alerts = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(groupedEvents).forEach(([machineSerial, events]) => {
        events.forEach(event => {
          const duringChipStayDispenseEvents = dispenseEvents
            .filter(dEvent => dEvent.parameters.rfid === event.rfid && dEvent.createdDate >= event.pushedAt && dEvent.createdDate <= event.droppedAt);
          const dispenseCount = duringChipStayDispenseEvents.length;
          const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, new BigNumber(dispenseCount));
          trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, dispenseCount, machineSerial));

          if (violatedThreshold) {
            alerts.push({
              description: `Chip with rfid ${event.rfid} chip stay KPI violation`,
              violatedThreshold,
              indicator,
              currentValue: dispenseCount,
              machineSerial,
            });
            if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
              cutoffs.push(machineSerial);
            }
          }
        });
      });
    } else {
      let totalEvents = new BigNumber(0);
      Object.entries(groupedEvents).forEach(([, events]) => {
        events.forEach(event => {
          const duringChipStayDispenseEvents = dispenseEvents
            .filter(dEvent => dEvent.parameters.rfid === event.rfid && dEvent.createdDate >= event.pushedAt && dEvent.createdDate <= event.droppedAt);
          totalEvents = totalEvents.plus(duringChipStayDispenseEvents.length);
        });
      });

      const avgChipStay = totalEvents.div(Object.entries(groupedEvents).length);
      if (avgChipStay.isNaN()) {
        this.logger.warn(`Chip stay KPI NaN calculated, events data: ${JSON.stringify(groupedEvents)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, avgChipStay);
      const currentValue = avgChipStay.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));

      if (violatedThreshold) {
        alerts.push({
          description: 'Chip stay KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(groupedEvents));
        }
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateIllegalChipDropsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating illegal chip drops metric');
    const illegalEventsUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.ILLEGAL_CHIP_DROP),
      (e => e.parameters.machineSerial));
    const illegalEvents = await this.populateGroupedEntitiesWithSerials(indicator, illegalEventsUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, illegalEvents, 'Illegal chip drop KPI violation');
  }

  private async calculateJackpotWonMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating jackpot win metric');
    const jackpotEventsUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.JACKPOT),
      (e => e.parameters.machineSerial));
    const jackpotEvents = await this.populateGroupedEntitiesWithSerials(indicator, jackpotEventsUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, jackpotEvents, 'Jackpot won KPI violation');
  }

  private async calculateHardwareFaultsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating hardware faults metric');
    const eventsGroupedUnpopulated = _.groupBy(await this.getHardwareFaultsBySegmentAndDimension(indicator),
      (e => e.machineSerial));
    const eventsGrouped = await this.populateGroupedEntitiesWithSerials(indicator, eventsGroupedUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, eventsGrouped, 'Hardware faults KPI violation');
  }

  private async calculateArmSwingsMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating arm swings metric');
    const swingEventsUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.ARM_SWING),
      (e => e.parameters.machineSerial));
    const swingEvents = await this.populateGroupedEntitiesWithSerials(indicator, swingEventsUnpopulated);

    await this.calculateEventCountTypeMetric(indicator, swingEvents, 'Arm swings KPI violation');
  }

  private async calculatePhantomValueVariationMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating phantom value variation metric');
    const payoutEventsUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.PHANTOM_PAYOUT),
      (e => e.parameters.machineSerial));
    const payoutEvents = await this.populateGroupedEntitiesWithSerials(indicator, payoutEventsUnpopulated);

    const alerts = [];
    const trackers = [];
    const cutoffs = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(payoutEvents).forEach(([machineSerial, events]) => {
        const totalPayouts = events.reduce((acc, e) => acc.plus(e.parameters.sum), new BigNumber(0));
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, totalPayouts);
        const currentValue = totalPayouts.dp(2).toNumber();
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue, machineSerial));
        if (violatedThreshold) {
          alerts.push({
            description: 'Phantom value variation KPI violation',
            violatedThreshold,
            indicator,
            currentValue,
            machineSerial,
            machineId: events[0].parameters.machineId,
          });
          if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
            cutoffs.push(machineSerial);
          }
        }
      });
    } else {
      let totalPayouts = new BigNumber(0);
      Object.entries(payoutEvents).forEach(([, events]) => {
        totalPayouts = totalPayouts.plus(events.reduce((acc, e) => acc.plus(e.parameters.sum), new BigNumber(0)));
      });
      const averagePayouts = totalPayouts.div(Object.entries(payoutEvents).length);
      if (averagePayouts.isNaN()) {
        this.logger.warn(`Phantom value variation KPI NaN calculated, events data: ${JSON.stringify(payoutEvents)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, averagePayouts);
      const currentValue = averagePayouts.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: 'Phantom value variation KPI violation', violatedThreshold, indicator, currentValue,
        });
        if (violatedThreshold === ViolatedThreshold.CUTOFF_HIGH || violatedThreshold === ViolatedThreshold.CUTOFF_LOW) {
          cutoffs.push(...Object.keys(payoutEvents));
        }
      }
    }

    await this.saveTrackers(trackers);
    await this.createAlerts(alerts);
    if (cutoffs.length) {
      await this.cutoffMachines(cutoffs);
    }
  }

  private async calculateOperatorLatencyMetric(indicator: PerformanceIndicatorEntity): Promise<void> {
    this.logger.log('Calculating operator latency metric');
    if (indicator.segment === PerformanceIndicatorSegment.GROUP || indicator.segment === PerformanceIndicatorSegment.MACHINE) {
      this.logger.warn(`${indicator.segment} not supported for operator latency metric`);
      return;
    }
    if (indicator.dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      this.logger.warn('Round dimension is not supported for operator latency metric');
      return;
    }
    const latencyEventsUnpopulated = _.groupBy(await this.getEventLogsBySegmentAndDimension(indicator, EventType.OPERATOR_LATENCY),
      (e => e.parameters.operatorId));
    const latencyEvents = await this.populateGroupedEntitiesWithSerials(indicator, latencyEventsUnpopulated);

    const alerts = [];
    const trackers = [];

    if (indicator.mode === PerformanceIndicatorMode.EACH) {
      Object.entries(latencyEvents).forEach(([operatorId, events]) => {
        const totalLatency = events.reduce((acc, e) => acc.plus(e.parameters.latency), new BigNumber(0));
        let averageLatency = totalLatency.div(Object.entries(events).length);
        if (averageLatency.isNaN()) {
          averageLatency = new BigNumber(0);
        }
        const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, averageLatency);
        const currentValue = averageLatency.dp(2).toNumber();
        trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue, operatorId));
        if (violatedThreshold) {
          alerts.push({
            description: `Operator id ${operatorId} latency KPI violation`,
            violatedThreshold,
            operatorId,
            indicator,
            currentValue,
          });
        }
      });
    } else {
      let totalLatency = new BigNumber(0);
      Object.entries(latencyEvents).forEach(([, events]) => {
        totalLatency = totalLatency.plus(events.reduce((acc, e) => acc.plus(e.parameters.latency), new BigNumber(0)));
      });
      const averageLatency = totalLatency.div(Object.entries(latencyEvents).length);
      if (averageLatency.isNaN()) {
        this.logger.warn(`Operator latency KPI NaN calculated, events data: ${JSON.stringify(latencyEvents)}`);
        return;
      }
      const violatedThreshold = TaskConsumer.checkViolatedThreshold(indicator, averageLatency);
      const currentValue = averageLatency.dp(2).toNumber();
      trackers.push(TaskConsumer.createTracker(indicator, violatedThreshold, currentValue));
      if (violatedThreshold) {
        alerts.push({
          description: 'Operator latency KPI violation', violatedThreshold, indicator, currentValue,
        });
      }
    }

    await this.saveTrackers(trackers);
    if (alerts.length > 0) {
      await this.createAlerts(alerts);
    }
  }

  private logTask(taskName: string, data: any) {
    this.logger.log(
      JSON.stringify({ taskName, data, timestamp: new Date().toISOString() }),
    );
  }

  private logTaskError(taskName: string, error: any) {
    this.logger.log(
      JSON.stringify({ taskName, error, timestamp: new Date().toISOString() }),
    );
  }
}

/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  AlertRepository,
  AlertSeverity,
  connectionNames,
  DashboardDataRepository,
  DashboardWidgets,
  getRepositoryToken,
  MachineRepository,
  MoreThan,
  PlayerEntity,
  PlayerRepository,
  RoundArchiveEntity,
  RoundArchiveRepository,
  SessionArchiveEntity,
  SessionArchiveRepository,
  SessionEntity,
  SessionRepository,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import {
  ActiveNewPlayers,
  ActiveNewPlayersResponse,
  ActiveSessionsBreakdownResponse,
  BettingActivity,
  BettingActivityResponse,
  ExistingNewPlayersResponse,
  LatestAlertsResponse,
  MachineAvailabilityResponse,
  MachinesStatusResponse,
  ThirtyDaysActiveNewPlayersResponse,
  TopWinnersLosersResponse,
  WaitTimeResponse,
} from './dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {
  }

  public async activeNewPlayers(contextId: ContextId): Promise<ActiveNewPlayersResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsArchiveRepository: SessionArchiveRepository = await this.moduleRef
      .resolve<SessionArchiveRepository>(getRepositoryToken(SessionArchiveRepository, connectionNames.DATA), contextId);
    const playersRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.ACTIVE_NEW_PLAYERS });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 5) {
      const sessions24 = await sessionsArchiveRepository.manager.query(`SELECT COUNT(DISTINCT player_cid) AS count FROM
      (SELECT player_cid, start_date as from_date FROM session_archive
      UNION SELECT player_cid, create_date as from_date FROM session) unitedSessions WHERE from_date >= ?`, [moment().subtract(24, 'hour').toISOString()]);
      const archivedSessions48 = await sessionsArchiveRepository.createQueryBuilder('session')
        .select('count(DISTINCT player_cid) AS count')
        .where('start_date > :from AND start_date < :to', {
          from: moment().subtract(48, 'hour').toISOString(),
          to: moment().subtract(24, 'hour').toISOString(),
        })
        .getRawOne();

      const newPlayers = await playersRepository.count({ createDate: MoreThan(moment().subtract(24, 'hour').toISOString()) });
      const newPlayers48 = await playersRepository.createQueryBuilder('player').where('create_date > :from AND create_date < :to', {
        from: moment().subtract(48, 'hour').toISOString(),
        to: moment().subtract(24, 'hour').toISOString(),
      }).getCount();

      const widgetData = {
        countActive: parseInt(sessions24[0]?.count, 10) || 0,
        countActivePrevious: parseInt(archivedSessions48.count, 10) || 0,
        countNew: newPlayers || 0,
        countNewPrevious: newPlayers48 || 0,
      };
      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.ACTIVE_NEW_PLAYERS;
        newData.data = widgetData;
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = widgetData;
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }
    return {
      countActive: existingData.data.countActive,
      countActivePrevious: existingData.data.countActivePrevious,
      countNew: existingData.data.countNew,
      countNewPrevious: existingData.data.countNewPrevious,
    };
  }

  public async existingNewPlayers(contextId: ContextId): Promise<ExistingNewPlayersResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const playersRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.EXISTING_NEW_PLAYERS });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 5) {
      const activePlayers = await playersRepository.getPlayersWithActiveSessions();
      const dayStart = moment().startOf('day');

      const widgetData = activePlayers.reduce((acc, player) => {
        if (moment(player.createDate).isAfter(dayStart)) {
          acc.countNew += 1;
        } else {
          acc.countExisting += 1;
        }
        return acc;
      }, {
        countExisting: 0,
        countNew: 0,
      });

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.EXISTING_NEW_PLAYERS;
        newData.data = widgetData;
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = widgetData;
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return {
      countExisting: existingData.data.countExisting,
      countNew: existingData.data.countNew,
    };
  }

  public async activeSessionsBreakdown(contextId: ContextId): Promise<ActiveSessionsBreakdownResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.ACTIVE_SESSIONS_BREAKDOWN });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 1) {
      const breakdown = await sessionsRepository.getActiveSessionsBreakdown();
      const widgetData = {
        countBetBehind: breakdown.countViewerBetBehind + breakdown.countQueueBetBehind,
        countInPlay: breakdown.countPlaying + breakdown.countAutoplaying,
        countObserving: breakdown.countViewer,
        countQueuing: breakdown.countQueue,
        countReBuy: breakdown.countReBuy,
      };

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.ACTIVE_SESSIONS_BREAKDOWN;
        newData.data = widgetData;
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = widgetData;
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return {
      countBetBehind: existingData.data.countBetBehind,
      countInPlay: existingData.data.countInPlay,
      countObserving: existingData.data.countObserving,
      countQueuing: existingData.data.countQueuing,
      countReBuy: existingData.data.countReBuy,
    };
  }

  public async machineAvailability(contextId: ContextId, groupIds?: string[]): Promise<MachineAvailabilityResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const machinesRepository: MachineRepository = await this.moduleRef
      .resolve<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.MACHINES_AVAILABILITY });

    if (!existingData || existingData.data.groupIds !== groupIds || moment().diff(moment(existingData.updateDate), 'minute') > 1) {
      const {
        countReady,
        countInPlay,
      } = await machinesRepository.getMachinesAvailabilityData(groupIds);

      const widgetData = {
        countReady,
        countInPlay,
      };

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.MACHINES_AVAILABILITY;
        newData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return existingData.data.widgetData;
  }

  public async machinesStatus(contextId: ContextId, groupIds?: string | string[]): Promise<MachinesStatusResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const machinesRepository: MachineRepository = await this.moduleRef
      .resolve<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA), contextId);

    if (!Array.isArray(groupIds) && groupIds) {
      groupIds = [groupIds];
    }

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.MACHINES_STATUS });

    if (!existingData || existingData.data.groupIds !== groupIds || moment().diff(moment(existingData.updateDate), 'minute') > 1) {
      const widgetData = await machinesRepository.getMachinesStatusBreakdown(groupIds as string[]);

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.MACHINES_STATUS;
        newData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return existingData.data.widgetData;
  }

  private severityToNumber(severity: AlertSeverity): number {
    switch (severity) {
      case AlertSeverity.HIGH:
        return 2;
      case AlertSeverity.MEDIUM:
        return 1;
      default:
        return 0;
    }
  }

  public async latestAlerts(contextId: ContextId): Promise<LatestAlertsResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.LATEST_ALERTS });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 5) {
      const widgetData = await alertRepository.getLatestAlerts();
      widgetData.sort((a, b) => this.severityToNumber(b.severity) - this.severityToNumber(a.severity));

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.LATEST_ALERTS;
        newData.data = { widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return { alerts: widgetData };
    }

    return { alerts: existingData.data.widgetData };
  }

  public async waitTime(contextId: ContextId, groupIds?: string | string[]): Promise<WaitTimeResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);

    if (!Array.isArray(groupIds) && groupIds) {
      groupIds = [groupIds];
    }

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.WAIT_TIME });

    if (!existingData || existingData.data.groupIds !== groupIds || moment().diff(moment(existingData.updateDate), 'minute') > 1) {
      const waitTimes = await sessionsRepository.getSessionWaitTimeData(groupIds as string[]);

      const widgetData = {
        averageWaitTime24: waitTimes.avg24,
        averageWaitTimeCurrent: waitTimes.avgCurrent,
        averageWaitTime24Previous: waitTimes.avg48,
      };

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.WAIT_TIME;
        newData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { groupIds, widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return existingData.data.widgetData;
  }

  private generateDateRange(from: moment.Moment): any[] {
    const objects = [];
    const now = moment().startOf('day');
    const tomorrow = now.add(1, 'day');
    while (from.isBefore(tomorrow)) {
      objects.push({
        date: from.toDate(),
      });
      from = from.add(1, 'day');
    }

    return objects;
  }

  private calculateBettingActivity(activeSessions: SessionEntity[], archivedSessions: SessionArchiveEntity[], rounds: RoundArchiveEntity[]): BettingActivity[] {
    const bets = this.generateDateRange(moment().subtract(29, 'days').startOf('day'));
    bets.forEach(b => {
      b.rounds = 0;
      b.bets = new BigNumber(0);
      b.wins = new BigNumber(0);
      activeSessions.forEach(s => {
        if (moment(s.updateDate).isSame(b.date, 'day')) {
          b.wins = b.wins.plus(s.totalWinning);
          b.bets = b.bets.plus(s.totalBets);
          b.rounds += s.rounds.length;
        }
      });
      archivedSessions.forEach(s => {
        if (moment(s.endDate).isSame(b.date, 'day')) {
          b.wins = b.wins.plus(s.totalWinning);
          b.bets = b.bets.plus(s.totalBets);
        }
      });
      rounds.forEach(r => {
        if ((moment(r.endDate).isSame(b.date, 'day'))) {
          b.rounds += 1;
        }
      });
      b.wins = b.wins.dp(2).toNumber();
      b.bets = b.bets.dp(2).toNumber();
    });

    return bets;
  }

  public async bettingActivity(contextId: ContextId): Promise<BettingActivityResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);
    const sessionsArchiveRepository: SessionArchiveRepository = await this.moduleRef
      .resolve<SessionArchiveRepository>(getRepositoryToken(SessionArchiveRepository, connectionNames.DATA), contextId);
    const roundsArchiveRepository: RoundArchiveRepository = await this.moduleRef
      .resolve<RoundArchiveRepository>(getRepositoryToken(RoundArchiveRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.BETTING_ACTIVITY });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 15) {
      const monthAgo = moment().subtract(30, 'days').toDate();
      const activeSessions = await sessionsRepository.find({
        where: { updateDate: MoreThan(monthAgo) },
        relations: ['rounds'],
        select: ['updateDate', 'totalWinning', 'totalBets'],
      });
      const archivedSessions = await sessionsArchiveRepository.find({
        where: { endDate: MoreThan(monthAgo) },
        select: ['totalWinning', 'totalBets', 'endDate'],
      });
      const archivedRounds = await roundsArchiveRepository.find({
        where: { endDate: MoreThan(monthAgo) },
        select: ['endDate'],
      });

      const widgetData = this.calculateBettingActivity(activeSessions, archivedSessions, archivedRounds);

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.BETTING_ACTIVITY;
        newData.data = { widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return { bets: widgetData };
    }

    return { bets: existingData.data.widgetData };
  }

  private calculateThirtyDaysActiveNewPlayers(sessions: (SessionEntity | SessionArchiveEntity)[], players: PlayerEntity[]): ActiveNewPlayers[] {
    const days = this.generateDateRange(moment().subtract(29, 'days').startOf('day'));
    days.forEach(d => {
      d.countNew = 0;
      const uniqueActive = new Set();
      sessions.forEach(s => {
        if (moment((s as SessionEntity).updateDate || (s as SessionArchiveEntity).endDate).isSame(d.date, 'day')) {
          uniqueActive.add((s as SessionEntity).player?.cid || (s as SessionArchiveEntity).playerCid);
        }
      });
      players.forEach(p => {
        if (moment(p.createDate).isSame(d.date, 'day')) {
          d.countNew += 1;
        }
      });
      d.countActive = uniqueActive.size;
    });

    return days;
  }

  public async thirtyDaysActiveNewPlayers(contextId: ContextId): Promise<ThirtyDaysActiveNewPlayersResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);
    const sessionsArchiveRepository: SessionArchiveRepository = await this.moduleRef
      .resolve<SessionArchiveRepository>(getRepositoryToken(SessionArchiveRepository, connectionNames.DATA), contextId);
    const playerRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.THIRTY_DAYS_ACTIVE_NEW_PLAYERS });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 15) {
      const monthAgo = moment().subtract(30, 'days').toDate();
      const players = await playerRepository.find({
        where: { createDate: MoreThan(monthAgo) },
        select: ['cid', 'createDate'],
      });
      const joinedSessions = (await Promise.all([sessionsRepository.find({
        where: { updateDate: MoreThan(monthAgo) },
        relations: ['player'],
        select: ['updateDate'],
      }),
      sessionsArchiveRepository.find({
        where: { endDate: MoreThan(monthAgo) },
        select: ['playerCid', 'endDate'],
      }),
      ])).flat();

      const widgetData = this.calculateThirtyDaysActiveNewPlayers(joinedSessions, players);

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.THIRTY_DAYS_ACTIVE_NEW_PLAYERS;
        newData.data = { widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return { stats: widgetData };
    }

    return { stats: existingData.data.widgetData };
  }

  public async topWinnersLosers(contextId: ContextId): Promise<TopWinnersLosersResponse> {
    const dashboardDataRepository: DashboardDataRepository = await this.moduleRef
      .resolve<DashboardDataRepository>(getRepositoryToken(DashboardDataRepository, connectionNames.DATA), contextId);
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);

    const existingData = await dashboardDataRepository.findOne({ id: DashboardWidgets.TOP_WINNERS_LOSERS });

    if (!existingData || moment().diff(moment(existingData.updateDate), 'minute') > 10) {
      const winnersLosers24h = await sessionsRepository.get24HoursWinnersLosers();
      const winnerLosersArray = [];
      for (const [k, v] of Object.entries(winnersLosers24h)) {
        winnerLosersArray.push({
          player: k, playerCid: k, win: v.win, loss: v.loss, online: v.online, // TODO: Replace player with name, not cid
        });
      }

      let winners = [...winnerLosersArray].filter(w => w.win !== 0).sort((a, b) => b.win - a.win);
      let losers = [...winnerLosersArray].filter(l => l.loss !== 0).sort((a, b) => b.loss - a.loss);

      if (winners.length > 5) {
        winners = winners.slice(0, 5);
      }

      if (losers.length > 5) {
        losers = losers.slice(0, 5);
      }

      const widgetData = {
        winners,
        losers,
      };

      if (!existingData) {
        const newData = dashboardDataRepository.create();
        newData.id = DashboardWidgets.TOP_WINNERS_LOSERS;
        newData.data = { widgetData };
        await dashboardDataRepository.save(newData);
      } else {
        existingData.data = { widgetData };
        await dashboardDataRepository.save(existingData);
      }

      return widgetData;
    }

    return existingData.data.widgetData;
  }
}
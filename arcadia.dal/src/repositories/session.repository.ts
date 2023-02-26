/* eslint-disable max-lines */
import * as moment from 'moment';
import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  PerformanceDimensionEntity,
  PerformanceIndicatorEntity,
  SessionArchiveEntity,
  SessionEntity,
} from '../entities';
import {
  PerformanceIndicatorDimension,
  PerformanceIndicatorSegment,
  SessionStatus,
} from '../enums';
import { SessionBreakdown, SessionInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';
import { RoundRepository } from './round.repository';
import { SessionArchiveRepository } from './session.archive.repository';

@EntityRepository(SessionEntity)
export class SessionRepository extends Repository<SessionEntity> {
  private buildWhereString(filters: any): { whereString: string, havingString: string, params: any[] } {
    let whereString = 'WHERE';
    const emptyWhereLength = whereString.length;
    let havingString = 'HAVING';
    const emptyHavingLength = havingString.length;
    const whereParams = [];
    const havingParams = [];
    if (filters.id) {
      whereString += ' id = ? AND';
      whereParams.push(filters.id);
    }
    if (filters.machineId) {
      whereString += ' machineId = ? AND';
      whereParams.push(filters.machineId);
    }
    if (filters.status) {
      whereString += ' status IN (?) AND';
      whereParams.push(filters.status);
    }
    if (filters.groupName) {
      whereString += ' groupName IN (?) AND';
      whereParams.push(filters.groupName);
    }
    if (filters.operatorName) {
      whereString += ' operatorName IN (?) AND';
      whereParams.push(filters.operatorName);
    }
    if (filters.playerCid) {
      whereString += ' playerCid = ? AND';
      whereParams.push(filters.playerCid);
    }
    if (filters.startDateFrom) {
      whereString += ' startDate >= ? AND';
      whereParams.push(filters.startDateFrom);
    }
    if (filters.startDateTo) {
      whereString += ' startDate <= ? AND';
      whereParams.push(filters.startDateTo);
    }
    if (filters.durationFrom) {
      whereString += ' duration >= ? AND';
      whereParams.push(filters.durationFrom);
    }
    if (filters.durationTo) {
      whereString += ' duration <= ? AND';
      whereParams.push(filters.durationTo);
    }
    if (filters.roundsFrom) {
      havingString += ' rounds >= ? AND';
      havingParams.push(filters.roundsFrom);
    }
    if (filters.roundsTo) {
      havingString += ' rounds <= ? AND';
      havingParams.push(filters.roundsTo);
    }
    if (filters.totalWinningFrom) {
      whereString += ' totalWinning >= ? AND';
      whereParams.push(filters.totalWinningFrom);
    }
    if (filters.totalWinningTo) {
      whereString += ' totalWinning <= ? AND';
      whereParams.push(filters.totalWinningTo);
    }
    if (filters.totalNetCashFrom) {
      whereString += ' totalNetCash >= ? AND';
      whereParams.push(filters.totalNetCashFrom);
    }
    if (filters.totalNetCashTo) {
      whereString += ' totalNetCash <= ? AND';
      whereParams.push(filters.totalNetCashTo);
    }
    if (filters.ip) {
      whereString += ' playerIp = ? AND';
      whereParams.push(filters.ip);
    }

    if (whereString.length === emptyWhereLength) {
      whereString = '';
    } else {
      whereString = whereString.slice(0, whereString.length - 4);
    }
    if (havingString.length === emptyHavingLength) {
      havingString = '';
    } else {
      havingString = havingString.slice(0, havingString.length - 4);
    }

    return {
      whereString,
      havingString,
      params: havingParams.concat(havingParams).concat(whereParams),
    };
  }

  private getAllSessionsDataCountQueries(where: string, having: string, orderBy: string, pagination: string): { query: string, countQuery: string } {
    const activeSessionSubQuery = `SELECT s.id AS id, s.duration AS duration,
     s.currency AS currency, s.os AS os,
     s.browser AS browser, s.status AS status,
     s.configuration AS systemSettings, s.player_cid AS playerCid,
     machine.id AS machineId, group.name AS groupName,
     operator.name AS operatorName, INET6_NTOA(s.player_ip) AS playerIp,
     s.create_date AS startDate, COUNT(round.id) AS rounds,
     s.total_winning AS totalWinning, s.total_net_cash AS totalNetCash,
     s.viewer_duration AS viewerDuration, s.queue_duration AS queueDuration,
     s.total_bets AS totalBets, s.total_stacks_used AS totalStacksUsed,
     s.client_version AS clientVersion, s.device_type AS deviceType
     FROM session s LEFT JOIN machine machine ON machine.id = s.machine_id
     LEFT JOIN \`group\` \`group\` ON \`group\`.id = s.group_id
     LEFT JOIN operator operator ON operator.id = s.operator_id
     LEFT JOIN round round ON round.session_id = s.id
     GROUP BY s.id ${having}`;
    const archivedSessionSubQuery = `SELECT s.id AS id, s.duration AS duration,
     s.currency AS currency, s.os AS os,
     s.browser AS browser, s.status AS status,
     s.configuration AS systemSettings, s.player_cid AS playerCid,
     s.machine_id AS machineId, s.group_name AS groupName,
     s.operator_name AS operatorName, INET6_NTOA(s.player_ip) AS playerIp,
     s.start_date AS startDate, COUNT(round.id) AS rounds,
     s.total_winning AS totalWinning, s.total_net_cash AS totalNetCash,
     s.viewer_duration AS viewerDuration, s.queue_duration AS queueDuration,
     s.total_bets AS totalBets, s.total_stacks_used AS totalStacksUsed,
     s.client_app_version AS clientVersion, s.device_type AS deviceType
     FROM session_archive s
     LEFT JOIN round_archive round ON s.id = round.session_id
     GROUP BY s.id ${having}`;
    const query = `SELECT * FROM (${activeSessionSubQuery} UNION ${archivedSessionSubQuery}) united ${where} ${orderBy} ${pagination}`;
    const countQuery = `SELECT COUNT(*) AS cnt FROM (${activeSessionSubQuery} UNION ${archivedSessionSubQuery}) united ${where}`;

    return { query, countQuery };
  }

  private buildOrderByString(sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'DESC'): string {
    const sortByStatusOrder = `CASE status WHEN 'viewer' THEN 1
         WHEN 'queue' THEN 2
         WHEN 'playing' THEN 3
         WHEN 'terminating' THEN 4
         WHEN 'completed' THEN 5
         WHEN 'terminated' THEN 6 END`;
    let sortParam: Sort = { sort: 'startDate', order: sortOrder };
    if (sortBy) {
      if (sortBy === 'ip') {
        sortBy = 'playerIp';
      }
      if (sortBy === 'status') {
        sortBy = sortByStatusOrder;
      }
      const computedParams = [
        'operatorName',
        'groupName',
        'machineId',
        'playerCid',
        'playerIp',
        'startDate',
        'rounds',
        sortByStatusOrder,
      ];
      if (sortBy === 'totalWinning' || sortBy === 'totalNetCash') {
        sortParam.sort = sortBy;
      } else {
        sortParam = setSorting(this, computedParams, sortBy, sortOrder);
      }
    }

    return `ORDER BY ${sortParam.sort} ${sortParam.order}`;
  }

  private getPagination(filters: any): string {
    const take = filters.take ? parseInt(filters.take, 10) : 20;
    const offset = filters.offset ? parseInt(filters.offset, 10) : 0;

    return `LIMIT ${take} OFFSET ${offset}`;
  }

  public async getAllSessions(filters: any): Promise<[SessionInterface[], number]> {
    const { whereString, havingString, params } = this.buildWhereString(filters);
    const orderByString = this.buildOrderByString(filters.sortBy, filters.sortOrder);
    const pagination = this.getPagination(filters);
    const {
      query,
      countQuery,
    } = this.getAllSessionsDataCountQueries(whereString, havingString, orderByString, pagination);

    const sessions = await this.query(query, params);
    const count = parseInt((await this.query(countQuery, params))[0].cnt, 10);

    sessions.forEach(s => {
      s.id = parseInt(s.id, 10);
      s.machineId = parseInt(s.machineId, 10);
      s.rounds = parseInt(s.rounds, 10);
      s.totalWinning = parseFloat(s.totalWinning);
      s.totalNetCash = parseFloat(s.totalNetCash);
      s.totalBets = parseFloat(s.totalBets);
      s.systemSettings = s.systemSettings ? JSON.parse(s.systemSettings) : {};
      s.operatorSettings = s.operatorSettings ? JSON.parse(s.operatorSettings) : {};
      s.groupSettings = s.groupSettings ? JSON.parse(s.groupSettings) : {};
    });

    return [sessions, count];
  }

  public async getNextSessionForQueue(queueId: number): Promise<SessionEntity | undefined> {
    return this.createQueryBuilder('s')
      .leftJoinAndSelect('s.player', 'p')
      .leftJoinAndSelect('s.operator', 'o')
      .leftJoinAndSelect('s.vouchers', 'v')
      .where('s.queue_id = :queueId', { queueId })
      .andWhere('s.status IN (:...statuses)',
        {
          statuses: [SessionStatus.QUEUE, SessionStatus.QUEUE_BET_BEHIND, SessionStatus.RE_BUY],
        })
      .orderBy('s.buy_date', 'ASC')
      .getOne();
  }

  public async getPlayersConnectedMachines(playerCid: string): Promise<string[]> {
    const query = this.createQueryBuilder('session')
      .select('machine.name', 'machineName')
      .distinct(true)
      .leftJoin('session.machine', 'machine')
      .andWhere('session.player_cid = :playerCid', { playerCid });

    const result = await query.getRawMany();
    return result.map(s => s.machineName);
  }

  public countWin(sessionId: number, winInValue: number, winInCash: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        totalWinning: () => `${this.metadata
          .findColumnWithPropertyName('totalWinning').databaseName} + ${winInValue}`,
        totalWinInCash: () => `${this.metadata
          .findColumnWithPropertyName('totalWinInCash').databaseName} + ${winInCash}`,
        totalNetCash: () => `${this.metadata
          .findColumnWithPropertyName('totalNetCash').databaseName} - ${winInValue}`,
      })
      .where({ id: sessionId })
      .execute();
  }

  public countNewRound(
    sessionId: number, bet: number, betInCash: number, deductRound = true,
    countToLimit = true,
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        roundsLeft: () => `${this.metadata
          .findColumnWithPropertyName('roundsLeft').databaseName} - ${deductRound ? 1 : 0}`,
        totalStacksUsed: () => `${this.metadata
          .findColumnWithPropertyName('totalStacksUsed').databaseName} + ${countToLimit ? 1 : 0}`,
        totalBets: () => `${this.metadata
          .findColumnWithPropertyName('totalBets').databaseName} + ${bet}`,
        totalBetsInCash: () => `${this.metadata
          .findColumnWithPropertyName('totalBetsInCash').databaseName} + ${betInCash}`,
        totalNetCash: () => `${this.metadata
          .findColumnWithPropertyName('totalNetCash').databaseName} + ${bet}`,
      })
      .where({ id: sessionId })
      .execute();
  }

  public registerScatter(sessionId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        roundsLeft: () => `${this.metadata
          .findColumnWithPropertyName('roundsLeft').databaseName} + 1`,
        pendingScatter: () => `${this.metadata
          .findColumnWithPropertyName('pendingScatter').databaseName} + 1`,
      })
      .where({ id: sessionId })
      .execute();
  }

  public getBetBehindersFromQueue(queueId: number): Promise<SessionEntity[]> {
    return this.createQueryBuilder('s')
      .leftJoinAndSelect('s.rounds', 'r')
      .where('s.queue_id = :queueId', { queueId })
      .andWhere('s.status IN (:...statuses)',
        { statuses: [SessionStatus.VIEWER_BET_BEHIND, SessionStatus.QUEUE_BET_BEHIND] })
      .getMany();
  }

  public async getActiveSessionsBreakdown(): Promise<SessionBreakdown> {
    const breakdown = await this.createQueryBuilder('s')
      .select('SUM(IF(s.status = \'viewer\', 1, 0))', 'countViewer')
      .addSelect('SUM(IF(s.status = \'queue\', 1, 0))', 'countQueue')
      .addSelect('SUM(IF(s.status = \'viewerBetBehind\', 1, 0))', 'countViewerBetBehind')
      .addSelect('SUM(IF(s.status = \'queueBetBehind\', 1, 0))', 'countQueueBetBehind')
      .addSelect('SUM(IF(s.status = \'playing\', 1, 0))', 'countPlaying')
      .addSelect('SUM(IF(s.status = \'autoplay\', 1, 0))', 'countAutoplaying')
      .addSelect('SUM(IF(s.status = \'reBuy\', 1, 0))', 'countReBuy')
      .getRawMany();

    Object.keys(breakdown[0]).forEach(k => breakdown[0][k] = parseInt(breakdown[0][k], 10));
    Object.keys(breakdown[0]).forEach(k => {
      if (breakdown[0][k] === null || Number.isNaN(breakdown[0][k])) breakdown[0][k] = 0;
    });
    return breakdown[0];
  }

  public async get24HoursWinnersLosers(): Promise<Record<string, any>> {
    const winsLossByPlayer: Record<string, any> = {};

    const activeSessionsWinnersLosers = await this.createQueryBuilder('s')
      .select('SUM(total_winning)', 'win')
      .addSelect('SUM(total_bets)', 'loss')
      .addSelect('player_cid', 'cid')
      .addSelect('true', 'online')
      .addGroupBy('player_cid')
      .where('update_date > :dayAgo', { dayAgo: moment().subtract(1, 'day').toDate() })
      .getRawMany();

    const archivedSessionsWinnersLosers = await this.manager.getCustomRepository(SessionArchiveRepository).createQueryBuilder('s')
      .select('SUM(total_winning)', 'win')
      .addSelect('SUM(total_bets)', 'loss')
      .addSelect('player_cid', 'cid')
      .addSelect('false', 'online')
      .addGroupBy('player_cid')
      .where('end_date > :dayAgo', { dayAgo: moment().subtract(1, 'day').toDate() })
      .getRawMany();

    const allSessions = [...activeSessionsWinnersLosers, ...archivedSessionsWinnersLosers];

    allSessions.forEach(v => {
      if (!winsLossByPlayer[v.cid]) {
        winsLossByPlayer[v.cid] = {
          win: parseFloat(v.win),
          loss: parseFloat(v.loss),
          online: false,
        };
      } else {
        winsLossByPlayer[v.cid].win += parseFloat(v.win);
        winsLossByPlayer[v.cid].loss += parseFloat(v.loss);
        if (v.online) {
          winsLossByPlayer[v.cid].online = true;
        }
      }
    });

    return winsLossByPlayer;
  }

  update(
    criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<SessionEntity>,
    partialEntity: QueryDeepPartialEntity<SessionEntity>,
    onUpdate?: (data: Partial<SessionEntity>, result: UpdateResult) => void | Promise<void>,
  ): Promise<UpdateResult> {
    return super.update(criteria, partialEntity)
      .then(async value => {
        if (onUpdate) {
          try {
            await onUpdate(partialEntity as Partial<SessionEntity>, value);
          } catch (e) {
            // ignored
          }
        }
        return value;
      });
  }

  public cancelBet(sessionId: number, betInValue: number, betInCash: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        totalBets: () => `${this.metadata
          .findColumnWithPropertyName('totalBets').databaseName} - ${betInValue}`,
        totalBetsInCash: () => `${this.metadata
          .findColumnWithPropertyName('totalBetsInCash').databaseName} - ${betInCash}`,
        totalNetCash: () => `${this.metadata
          .findColumnWithPropertyName('totalNetCash').databaseName} - ${betInValue}`,
        roundsLeft: () => `${this.metadata
          .findColumnWithPropertyName('roundsLeft').databaseName} + 1`,
      })
      .where('id = :sessionId', { sessionId })
      .execute();
  }

  public async getSessionsByLastRoundsAndSegment(
    indicator: PerformanceIndicatorEntity, lastRounds: number, fromArchive = false,
  ): Promise<SessionEntity[] | SessionArchiveEntity[]> {
    const rounds = await this.manager.getCustomRepository(RoundRepository)
      .getRoundsBySegment(indicator, lastRounds, fromArchive);
    const sessionIds = (rounds as any[]).map(r => r.sessionId);
    return fromArchive ? this.manager.getCustomRepository(SessionArchiveRepository)
      .findByIds(sessionIds) : (rounds as any[]).map(r => r.session);
  }

  public async getSessionsBySegmentAndDimension(
    indicator: PerformanceIndicatorEntity,
    dimension: PerformanceDimensionEntity,
    fromArchive = false,
  ): Promise<SessionEntity[] | SessionArchiveEntity[]> {
    const sessionQuery = fromArchive ? this.manager.getCustomRepository(SessionArchiveRepository)
      .createQueryBuilder('session') : this.createQueryBuilder('session');
    if (dimension.dimensionType === PerformanceIndicatorDimension.MINUTE) {
      sessionQuery.where(`session.${fromArchive ? 'start_date' : 'create_date'} > :date`, { date: moment().subtract(dimension.value, 'minute').toISOString() });
    } else {
      return this.getSessionsByLastRoundsAndSegment(indicator, dimension.value, fromArchive);
    }

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          sessionQuery.andWhere(`session.${fromArchive ? 'group_id' : 'group.id'} = :id`, { id: indicator.subSegment.group });
        }
        break;
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          sessionQuery.andWhere(`session.${fromArchive ? 'machine_id' : 'machine.id'} = :id`, { id: indicator.subSegment.machine });
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          sessionQuery.andWhere(`${fromArchive ? 'session.operator_id' : 'operator.id'} = :id`, { id: indicator.subSegment.operator });
        }
        break;
      default:
        break;
    }

    return fromArchive ? sessionQuery.select().leftJoin('queue', 'queue', 'session.queue_id=queue.id').getMany()
      : sessionQuery.select()
        .leftJoin('session.queue', 'queue')
        .leftJoin('session.group', 'group')
        .leftJoinAndSelect('session.machine', 'machine')
        .leftJoin('session.operator', 'operator')
        .getMany();
  }

  public async getSessionWaitTimeData(groupIds?: string[]): Promise<{ avgCurrent: number, avg24: number, avg48: number }> {
    const activeSessionTime = await this.manager
      .query(`SELECT (SUM(viewer_duration) + SUM(queue_duration))/COUNT(group_id) AS avg FROM session${groupIds ? ' WHERE group_id IN (?)' : ''}`, [groupIds]);
    const sessionTimes24 = await this.manager.query(
      `SELECT (SUM(viewer_duration) + SUM(queue_duration))/COUNT(group_id) as avg FROM
      (SELECT group_id, viewer_duration, queue_duration, start_date as ddd FROM session_archive
      UNION
      SELECT group_id, viewer_duration, queue_duration, session.create_date as ddd FROM session
      INNER JOIN \`group\` ON group_id = \`group\`.id) sess
      WHERE ddd > NOW() - INTERVAL 1 day ${groupIds ? ' AND group_id IN (?)' : ''}
      GROUP BY group_id`, [groupIds]);
    const sessionTimes48 = await this.manager.query(
      `SELECT (SUM(viewer_duration) + SUM(queue_duration))/COUNT(group_id) as avg FROM
      (SELECT group_id, viewer_duration, queue_duration, start_date as ddd FROM session_archive
      UNION
      SELECT group_id, viewer_duration, queue_duration, session.create_date as ddd FROM session
      INNER JOIN \`group\` ON group_id = \`group\`.id) sess
      WHERE (ddd BETWEEN NOW() - INTERVAL 2 day AND NOW() - INTERVAL 1 day) ${groupIds ? ' AND group_id IN (?)' : ''}
      GROUP BY group_id`, [groupIds]);

    return {
      avgCurrent: Number(activeSessionTime[0]?.avg || 0),
      avg24: Number(sessionTimes24[0]?.avg || 0),
      avg48: Number(sessionTimes48[0]?.avg || 0),
    };
  }

  public async getStaleViewers(thresholdSec: number): Promise<number[]> {
    const result = await this.createQueryBuilder('s')
      .select('s.id', 'sessionId')
      .where(`s.status = '${SessionStatus.VIEWER}'`)
      .andWhere('s.is_disconnected = TRUE')
      .andWhere(`s.last_disconnect_date < DATE_SUB(NOW(), INTERVAL ${thresholdSec} SECOND)`)
      .getRawMany();
    return result?.length ? result.map(value => Number(value.sessionId)) : [];
  }

  public getJackpotTargetSessions(cid: string, jackpotOperatorId: string): Promise<SessionEntity[]> {
    return this.createQueryBuilder('s')
      .leftJoinAndSelect('s.player', 'p')
      .leftJoinAndSelect('s.operator', 'o')
      .leftJoinAndSelect('s.rounds', 'r')
      .leftJoinAndSelect('s.machine', 'm')
      .leftJoinAndSelect('s.group', 'g')
      .where('p.cid = :cid', { cid })
      .andWhere('o.blue_ribbon_id = :jackpotOperatorId', { jackpotOperatorId })
      .getMany();
  }

  public countJackpotWin(sessionId: number, winInValue: number, winInCash: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        totalWinning: () => `${this.metadata
          .findColumnWithPropertyName('totalWinning').databaseName} + ${winInValue}`,
        totalWinInCash: () => `${this.metadata
          .findColumnWithPropertyName('totalWinInCash').databaseName} + ${winInCash}`,
        jackpotWin: () => `${this.metadata
          .findColumnWithPropertyName('jackpotWin').databaseName} + ${winInValue}`,
      })
      .where({ id: sessionId })
      .execute();
  }
}

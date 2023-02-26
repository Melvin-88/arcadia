/* eslint-disable max-lines */
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { SessionArchiveEntity } from '../entities';
import {
  RetentionReportStreamInterface,
  SessionArchiveReportStreamInterface,
} from '../reports/interfaces';

@EntityRepository(SessionArchiveEntity)
export class SessionArchiveRepository extends Repository<SessionArchiveEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<SessionArchiveEntity>): void {
    if (filters.id) {
      queryBuilder.andWhere('session_archive.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('session_archive.status IN (:status)', { status: filters.status });
    }
    if (filters.operatorId) {
      queryBuilder.andWhere('session_archive.operator_id IN (:operatorId)', { operatorId: filters.operatorId });
    }
    if (filters.siteId) {
      queryBuilder.andWhere('session_archive.site_id IN (:siteId)', { siteId: filters.siteId });
    }
    if (filters.groupName) {
      queryBuilder.andWhere('session_archive.group_name IN (:groupName)', { groupName: filters.groupName });
    }
    if (filters.machineId) {
      queryBuilder.andWhere('session_archive.machine_id = :machineId', { machineId: filters.machineId });
    }
    if (filters.denomination) {
      queryBuilder.andWhere('session_archive.denominator IN (:denomination)', { denomination: filters.denomination });
    }
    if (filters.playerCid) {
      queryBuilder.andWhere('session_archive.player_cid = :playerCid', { playerCid: filters.playerCid });
    }
    if (filters.playerId) {
      queryBuilder.andWhere('session_archive.player_cid = :playerCid', { playerCid: filters.playerId });
    }
    if (filters.sessionId) {
      queryBuilder.andWhere('session_archive.id = :sessionId', { sessionId: filters.sessionId });
    }
    if (filters.startDateFrom) {
      queryBuilder.andWhere('session_archive.start_date >= :startDateFrom', { startDateFrom: filters.startDateFrom });
    }
    if (filters.startDateTo) {
      queryBuilder.andWhere('session_archive.start_date <= :startDateTo', { startDateTo: filters.startDateTo });
    }
    if (filters.durationFrom) {
      queryBuilder.andWhere('session_archive.duration >= :durationFrom', { durationFrom: filters.durationFrom });
    }
    if (filters.durationTo) {
      queryBuilder.andWhere('session_archive.duration <= :durationTo', { durationTo: filters.durationTo });
    }
    if (filters.roundsFrom) {
      queryBuilder.andHaving('rounds >= :roundsFrom', { roundsFrom: filters.roundsFrom });
    }
    if (filters.roundsTo) {
      queryBuilder.andHaving('rounds <= :roundsTo', { roundsTo: filters.roundsTo });
    }
    if (filters.totalWinningFrom) {
      queryBuilder.andWhere('session_archive.total_winning >= :totalWinningFrom', { totalWinningFrom: filters.totalWinningFrom });
    }
    if (filters.totalWinningTo) {
      queryBuilder.andWhere('session_archive.total_winning <= :totalWinningTo', { totalWinningTo: filters.totalWinningTo });
    }
    if (filters.totalNetCashFrom) {
      queryBuilder.andWhere('session_archive.total_net_cash >= :totalNetCashFrom', { totalNetCashFrom: filters.totalNetCashFrom });
    }
    if (filters.totalNetCashTo) {
      queryBuilder.andWhere('session_archive.total_net_cash <= :totalNetCashTo', { totalNetCashTo: filters.totalNetCashTo });
    }
    if (filters.ip) {
      queryBuilder.andWhere('INET6_NTOA(session_archive.player_ip) = :ip', { ip: filters.ip });
    }
    if (filters.newPlayersOnly) {
      queryBuilder.andWhere(`CAST(player.create_date AS DATE) IN(${filters.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')})`);
    }
  }

  public async getSessionArchiveReportStream(data: any): Promise<Observable<SessionArchiveReportStreamInterface[]>> {
    const query = this.createQueryBuilder('session_archive')
      .select('session_archive.id', 'id')
      .addSelect('session_archive.player_cid', 'player_cid')
      .addSelect('session_archive.duration', 'duration')
      .addSelect('session_archive.viewer_duration', 'viewer_duration')
      .addSelect('session_archive.queue_duration', 'queue_duration')
      .addSelect('session_archive.operator_id', 'operator')
      .addSelect('session_archive.machine_id', 'machine')
      .addSelect('session_archive.site_id', 'site')
      .addSelect('session_archive.start_date', 'start_date')
      .addSelect('CAST(session_archive.end_date AS DATE)', 'day')
      .addSelect('CONCAT(MONTH(session_archive.end_date), "/", YEAR(session_archive.end_date))', 'month')
      .where(`CAST(session_archive.end_date AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')})`)
      .leftJoin('round_archive', 'round', 'session_archive.id=round.session_id')
      .leftJoin('player', 'player', 'session_archive.player_cid=player.cid')
      .addSelect('round.id', 'round_id')
      .addSelect('round.bet', 'round_bet')
      .addSelect('round.wins', 'round_wins')
      .addSelect('round.status', 'round_status')
      .addSelect('round.is_autoplay', 'round_is_autoplay')
      .addSelect('round.type', 'round_type')
      .addSelect('session_archive.group_id', 'group')
      .addSelect('session_archive.denominator', 'denomination')
      .addSelect('session_archive.currency', 'currency')
      .addSelect('session_archive.is_denomination_changed', 'is_denomination_changed')
      .addSelect('player.create_date', 'player_create_date')
      .orderBy('session_archive.end_date', 'ASC');

    this.buildWhereString({ ...data.params, daysToCreate: data.daysToCreate }, query);

    const stream = await query.stream();

    return new Observable(subscriber => {
      let dayBuffer: SessionArchiveReportStreamInterface[] = [];

      stream.on('data', (data: SessionArchiveReportStreamInterface) => {
        data.day = moment(data.day).format('YYYY-MM-DD');

        if (dayBuffer.length === 0 || moment(dayBuffer[0].day).format('YYYY-MM-DD') === data.day) {
          dayBuffer.push(data);
        } else {
          subscriber.next(dayBuffer);
          dayBuffer = [data];
        }
      });

      stream.on('end', () => {
        subscriber.next(dayBuffer);
        subscriber.complete();
      });

      stream.on('error', error => {
        subscriber.error(error);
      });
    });
  }

  public async getSessionArchiveStreamForRetentionReport(data: any): Promise<Observable<RetentionReportStreamInterface[]>> {
    const query = this.createQueryBuilder('session_archive')
      .select('session_archive.id', 'id')
      .addSelect('session_archive.player_cid', 'player_cid')
      .addSelect('CAST(session_archive.end_date AS DATE)', 'day')
      .addSelect('CONCAT(MONTH(session_archive.end_date), "/", YEAR(session_archive.end_date))', 'month')
      .addSelect('session_archive.denominator', 'denomination')
      .addSelect('session_archive.operator_id', 'operator')
      .leftJoin('player', 'player', 'session_archive.player_cid=player.cid')
      .addSelect('CAST(player.create_date AS DATE)', 'player_create_date')
      .where(`CAST(session_archive.end_date AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')})`)
      .orderBy('session_archive.end_date', 'ASC');

    this.buildWhereString({ ...data.params, daysToCreate: data.daysToCreate }, query);

    const stream = await query.stream();

    return new Observable(subscriber => {
      let dayBuffer: RetentionReportStreamInterface[] = [];

      stream.on('data', (data: RetentionReportStreamInterface) => {
        data.day = moment(data.day).format('YYYY-MM-DD');
        data.player_create_date = moment(data.player_create_date).format('YYYY-MM-DD');

        if (dayBuffer.length === 0 || moment(dayBuffer[0].day).format('YYYY-MM-DD') === data.day) {
          dayBuffer.push(data);
        } else {
          subscriber.next(dayBuffer);
          dayBuffer = [data];
        }
      });

      stream.on('end', () => {
        subscriber.next(dayBuffer);
        subscriber.complete();
      });

      stream.on('error', error => subscriber.error(error));
    });
  }
}

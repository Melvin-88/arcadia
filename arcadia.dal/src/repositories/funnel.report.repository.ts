import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import { NotAcceptableException } from '@nestjs/common';
import { FunnelReportEntity } from '../entities';
import {
  CheckingReportAvailabilityInterface,
  FunnelReportInterface,
  FunnelReportsInterface,
} from '../reports/interfaces';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';
import { FunnelReportGroupingKeys } from '../enums';

@EntityRepository(FunnelReportEntity)
export class FunnelReportRepository extends Repository<FunnelReportEntity> {
  private buildFunnelReportQuery(filters: any): SelectQueryBuilder<FunnelReportEntity> {
    const totalUniquePlayersSubQuery = this.getTotalUniquePlayersSubQuery(filters);

    return this.createQueryBuilder('funnel_report')
      .select(filters.groupBy === FunnelReportGroupingKeys.DAY || filters.groupBy === FunnelReportGroupingKeys.MONTH
        ? 'funnel_report.grouping_value'
        : 'CAST(funnel_report.grouping_value AS DOUBLE)', 'grouping_value')
      .addSelect(totalUniquePlayersSubQuery, 'total_unique_players')
      .addSelect('SUM(funnel_report.total_unique_sessions)', 'total_unique_sessions')
      .addSelect('SUM(funnel_report.total_session_time)', 'total_session_time')
      .addSelect('SUM(funnel_report.total_rounds_played)', 'total_rounds_played')
      .addSelect('SUM(funnel_report.total_watch_time)', 'total_watch_time')
      .addSelect('MAX(funnel_report.max_watch_time)', 'max_watch_time')
      .addSelect('SUM(funnel_report.total_queue_time)', 'total_queue_time')
      .addSelect('MAX(funnel_report.max_queue_time)', 'max_queue_time')
      .addSelect('SUM(funnel_report.total_in_play_time)', 'total_in_play_time')
      .addSelect('MAX(funnel_report.max_in_play_time)', 'max_in_play_time')
      .addSelect('SUM(funnel_report.total_sessions_watch)', 'total_sessions_watch')
      .addSelect('SUM(funnel_report.total_sessions_queue)', 'total_sessions_queue')
      .addSelect('SUM(funnel_report.total_sessions_behind)', 'total_sessions_behind')
      .addSelect('SUM(funnel_report.total_sessions_in_play)', 'total_sessions_in_play')
      .addSelect('SUM(funnel_report.total_sessions_change_denomination)', 'total_sessions_change_denomination')
      .addSelect('ROUND((SUM(funnel_report.total_session_time) / SUM(funnel_report.total_unique_sessions)), 2)', 'avg_session_time')
      .addSelect('ROUND((SUM(funnel_report.total_rounds_played) / SUM(funnel_report.total_unique_sessions)), 2)', 'avg_rounds_per_session')
      .addSelect(`ROUND((SUM(funnel_report.total_watch_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_watch_time')
      .addSelect(`ROUND((SUM(funnel_report.total_queue_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_queue_time')
      .addSelect(`ROUND((SUM(funnel_report.total_in_play_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_in_play_time')
      .addSelect('ROUND(((SUM(funnel_report.total_sessions_watch) / SUM(funnel_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_watch')
      .addSelect('ROUND(((SUM(funnel_report.total_sessions_queue) / SUM(funnel_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_queue')
      .addSelect('ROUND(((SUM(funnel_report.total_sessions_behind) / SUM(funnel_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_behind')
      .addSelect('ROUND(((SUM(funnel_report.total_sessions_in_play) / SUM(funnel_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_in_play')
      .addSelect('ROUND(((SUM(funnel_report.total_sessions_change_denomination) / SUM(funnel_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_change_denomination');
  }

  public async getFunnelReport(filters: any): Promise<FunnelReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildFunnelReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('funnel_report.params_hash = :paramsHash',
        { paramsHash: objectHash(omitReportParams(filters)) })
      .andWhere('funnel_report.grouping_value IS NOT NULL')
      .groupBy('funnel_report.grouping_value')
      .orderBy(filters.sortBy || FunnelReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('funnel_report')
      .select('COUNT(DISTINCT funnel_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('funnel_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('funnel_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): FunnelReportInterface => ({
        grouping_value: item.grouping_value,
        total_unique_players: Number(item.total_unique_players),
        total_unique_sessions: Number(item.total_unique_sessions),
        total_session_time: Number(item.total_session_time),
        avg_session_time: Number(item.avg_session_time),
        total_rounds_played: Number(item.total_rounds_played),
        avg_rounds_per_session: Number(item.avg_rounds_per_session),
        total_watch_time: Number(item.total_watch_time),
        avg_watch_time: Number(item.avg_watch_time),
        max_watch_time: Number(item.max_watch_time),
        total_queue_time: Number(item.total_queue_time),
        avg_queue_time: Number(item.avg_queue_time),
        max_queue_time: Number(item.max_queue_time),
        total_in_play_time: Number(item.total_in_play_time),
        avg_in_play_time: Number(item.avg_in_play_time),
        max_in_play_time: Number(item.max_in_play_time),
        total_sessions_watch: Number(item.total_sessions_watch),
        percent_sessions_watch: Number(item.percent_sessions_watch),
        total_sessions_queue: Number(item.total_sessions_queue),
        percent_sessions_queue: Number(item.percent_sessions_queue),
        total_sessions_behind: Number(item.total_sessions_behind),
        percent_sessions_behind: Number(item.percent_sessions_behind),
        total_sessions_in_play: Number(item.total_sessions_in_play),
        percent_sessions_in_play: Number(item.percent_sessions_in_play),
        total_sessions_change_denomination: Number(item.total_sessions_change_denomination),
        percent_sessions_change_denomination: Number(item.percent_sessions_change_denomination),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('funnel_report')
      .select('funnel_report.date', 'date')
      .addSelect('funnel_report.is_completed', 'isCompleted')
      .addSelect('funnel_report.grouping_key', 'groupingKey')
      .addSelect('funnel_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('funnel_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
      .getRawMany();

    const daysToCreate = _.difference(
      getDaysBetweenDates(params.startDate, params.endDate),
      data.map(item => moment(item.date).format('YYYY-MM-DD')),
    );

    const inProgressCount = data.filter(item => !item.groupingValue && !item.groupingKey).length;

    return {
      info: {
        available: getUniqArray(data.filter(item => item.isCompleted).map(item => item.date)).length,
        inProgress: inProgressCount,
        toCreate: daysToCreate.length,
      },
      daysToCreate,
    };
  }

  private getTotalUniquePlayersSubQuery(filters: any): string {
    let base = '(SELECT COUNT(DISTINCT session_archive.player_cid) FROM session_archive LEFT JOIN player player ON session_archive.player_cid=player.cid '
      + `WHERE CAST(session_archive.end_date AS DATE) BETWEEN CAST('${filters.startDate}' AS DATE) AND CAST('${filters.endDate}' AS DATE) `;

    if (filters.newPlayersOnly) {
      base += `AND player.create_date BETWEEN CAST('${filters.startDate}' AS DATE) AND CAST('${filters.endDate}' AS DATE) `;
    }

    switch (filters.groupBy) {
      case FunnelReportGroupingKeys.DAY:
        return `${base} AND CAST(session_archive.end_date AS DATE) = CAST(funnel_report.grouping_value AS DATE))`;
      case FunnelReportGroupingKeys.DENOMINATION:
        return `${base} AND session_archive.denominator = funnel_report.grouping_value)`;
      case FunnelReportGroupingKeys.GROUP:
        return `${base} AND session_archive.group_id = funnel_report.grouping_value)`;
      case FunnelReportGroupingKeys.MACHINE:
        return `${base} AND session_archive.machine_id = funnel_report.grouping_value)`;
      case FunnelReportGroupingKeys.MONTH:
        return `${base} AND CONCAT(MONTH(session_archive.end_date), "/", YEAR(session_archive.end_date)) = funnel_report.grouping_value)`;
      case FunnelReportGroupingKeys.OPERATOR:
        return `${base} AND session_archive.operator_id = funnel_report.grouping_value)`;
      case FunnelReportGroupingKeys.SITE:
        return `${base} AND session_archive.site_id = funnel_report.grouping_value)`;
      default:
        throw new NotAcceptableException('Wrong grouping key passed');
    }
  }
}

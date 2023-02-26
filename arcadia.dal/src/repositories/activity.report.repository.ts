/* eslint-disable max-lines */
import { NotAcceptableException } from '@nestjs/common';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ActivityReportEntity } from '../entities';
import { ActivityReportGroupingKeys } from '../enums';
import {
  ActivityReportInterface,
  ActivityReportsInterface,
  CheckingReportAvailabilityInterface,
} from '../reports/interfaces';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';

@EntityRepository(ActivityReportEntity)
export class ActivityReportRepository extends Repository<ActivityReportEntity> {
  private buildActivityReportQuery(filters: any): SelectQueryBuilder<ActivityReportEntity> {
    const totalUniquePlayersSubQuery = this.getTotalUniquePlayersSubQuery(filters.groupBy, filters.startDate, filters.endDate);

    return this.createQueryBuilder('activity_report')
      .select(filters.groupBy === ActivityReportGroupingKeys.DAY || filters.groupBy === ActivityReportGroupingKeys.MONTH
        ? 'activity_report.grouping_value'
        : 'CAST(activity_report.grouping_value AS DOUBLE)', 'grouping_value')
      .addSelect(totalUniquePlayersSubQuery, 'total_unique_players')
      .addSelect('SUM(activity_report.total_new_players)', 'total_new_players')
      .addSelect('SUM(activity_report.total_unique_sessions)', 'total_unique_sessions')
      .addSelect('SUM(activity_report.total_session_time)', 'total_session_time')
      .addSelect('SUM(activity_report.total_rounds_played)', 'total_rounds_played')
      .addSelect('SUM(activity_report.total_bets)', 'total_bets')
      .addSelect('SUM(activity_report.total_wins)', 'total_wins')
      .addSelect('SUM(activity_report.total_behind_bets)', 'total_behind_bets')
      .addSelect('SUM(activity_report.total_behind_wins)', 'total_behind_wins')
      .addSelect('SUM(activity_report.total_voucher_bets)', 'total_voucher_bets')
      .addSelect('SUM(activity_report.total_voucher_wins)', 'total_voucher_wins')
      .addSelect('SUM(activity_report.total_refunds)', 'total_refunds')
      .addSelect('SUM(activity_report.total_gross_gaming)', 'total_gross_gaming')
      .addSelect('SUM(activity_report.total_net_gaming)', 'total_net_gaming')
      .addSelect('SUM(activity_report.total_watch_time)', 'total_watch_time')
      .addSelect('MAX(activity_report.max_watch_time)', 'max_watch_time')
      .addSelect('SUM(activity_report.total_queue_time)', 'total_queue_time')
      .addSelect('MAX(activity_report.max_queue_time)', 'max_queue_time')
      .addSelect('SUM(activity_report.total_in_play_time)', 'total_in_play_time')
      .addSelect('MAX(activity_report.max_in_play_time)', 'max_in_play_time')
      .addSelect('SUM(activity_report.total_autoplay_bets)', 'total_autoplay_bets')
      .addSelect('SUM(activity_report.total_autoplay_wins)', 'total_autoplay_wins')
      .addSelect('SUM(activity_report.total_sessions_watch)', 'total_sessions_watch')
      .addSelect('SUM(activity_report.total_sessions_queue)', 'total_sessions_queue')
      .addSelect('SUM(activity_report.total_sessions_behind)', 'total_sessions_behind')
      .addSelect('SUM(activity_report.total_sessions_in_play)', 'total_sessions_in_play')
      .addSelect('ROUND((SUM(activity_report.total_session_time) / SUM(activity_report.total_unique_sessions)), 2)', 'avg_session_time')
      .addSelect('ROUND((SUM(activity_report.total_rounds_played) / SUM(activity_report.total_unique_sessions)), 2)', 'avg_rounds_per_session')
      .addSelect(`ROUND((SUM(activity_report.total_watch_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_watch_time')
      .addSelect(`ROUND((SUM(activity_report.total_queue_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_queue_time')
      .addSelect(`ROUND((SUM(activity_report.total_in_play_time) / ${totalUniquePlayersSubQuery}), 2)`, 'avg_in_play_time')
      .addSelect('ROUND(((SUM(activity_report.total_autoplay_sessions) / SUM(activity_report.total_unique_sessions)) * 100), 2)', 'percent_autoplay_sessions')
      .addSelect('ROUND(((SUM(activity_report.total_sessions_watch) / SUM(activity_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_watch')
      .addSelect('ROUND(((SUM(activity_report.total_sessions_queue) / SUM(activity_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_queue')
      .addSelect('ROUND(((SUM(activity_report.total_sessions_behind) / SUM(activity_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_behind')
      .addSelect('ROUND(((SUM(activity_report.total_sessions_in_play) / SUM(activity_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_in_play');
  }

  public async getActivityReport(filters: any): Promise<ActivityReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));
    const dataQuery = this.buildActivityReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('activity_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('activity_report.grouping_value IS NOT NULL')
      .groupBy('activity_report.grouping_value')
      .orderBy(filters.sortBy || ActivityReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('activity_report')
      .select('COUNT(DISTINCT activity_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('activity_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('activity_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): ActivityReportInterface => ({
        grouping_value: item.grouping_value,
        total_unique_players: Number(item.total_unique_players),
        total_new_players: Number(item.total_new_players),
        total_unique_sessions: Number(item.total_unique_sessions),
        total_session_time: Number(item.total_session_time),
        avg_session_time: Number(item.avg_session_time),
        total_rounds_played: Number(item.total_rounds_played),
        avg_rounds_per_session: Number(item.avg_rounds_per_session),
        total_bets: Number(item.total_bets),
        total_wins: Number(item.total_wins),
        total_behind_bets: Number(item.total_behind_bets),
        total_behind_wins: Number(item.total_behind_wins),
        total_voucher_bets: Number(item.total_voucher_bets),
        total_voucher_wins: Number(item.total_voucher_wins),
        total_refunds: Number(item.total_refunds),
        total_gross_gaming: Number(item.total_gross_gaming),
        total_net_gaming: Number(item.total_net_gaming),
        total_watch_time: Number(item.total_watch_time),
        avg_watch_time: Number(item.avg_watch_time),
        max_watch_time: Number(item.max_watch_time),
        total_queue_time: Number(item.total_queue_time),
        avg_queue_time: Number(item.avg_queue_time),
        max_queue_time: Number(item.max_queue_time),
        total_in_play_time: Number(item.total_in_play_time),
        avg_in_play_time: Number(item.avg_in_play_time),
        max_in_play_time: Number(item.max_in_play_time),
        total_autoplay_bets: Number(item.total_autoplay_bets),
        total_autoplay_wins: Number(item.total_autoplay_wins),
        percent_autoplay_sessions: Number(item.percent_autoplay_sessions),
        total_sessions_watch: Number(item.total_sessions_watch),
        percent_sessions_watch: Number(item.percent_sessions_watch),
        total_sessions_queue: Number(item.total_sessions_queue),
        percent_sessions_queue: Number(item.percent_sessions_queue),
        total_sessions_behind: Number(item.total_sessions_behind),
        percent_sessions_behind: Number(item.percent_sessions_behind),
        total_sessions_in_play: Number(item.total_sessions_in_play),
        percent_sessions_in_play: Number(item.percent_sessions_in_play),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('activity_report')
      .select('activity_report.date', 'date')
      .addSelect('activity_report.is_completed', 'isCompleted')
      .addSelect('activity_report.grouping_key', 'groupingKey')
      .addSelect('activity_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('activity_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
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

  private getTotalUniquePlayersSubQuery(groupingKey: ActivityReportGroupingKeys, startDate: string, endDate: string): string {
    const base = '(SELECT COUNT(DISTINCT session_archive.player_cid) FROM session_archive '
      + `WHERE CAST(session_archive.end_date AS DATE) BETWEEN CAST('${startDate}' AS DATE) AND CAST('${endDate}' AS DATE) `;
    switch (groupingKey) {
      case ActivityReportGroupingKeys.DAY:
        return `${base} AND CAST(session_archive.end_date AS DATE) = CAST(activity_report.grouping_value AS DATE))`;
      case ActivityReportGroupingKeys.DENOMINATION:
        return `${base} AND session_archive.denominator = activity_report.grouping_value)`;
      case ActivityReportGroupingKeys.GROUP:
        return `${base} AND session_archive.group_id = activity_report.grouping_value)`;
      case ActivityReportGroupingKeys.MACHINE:
        return `${base} AND session_archive.machine_id = activity_report.grouping_value)`;
      case ActivityReportGroupingKeys.MONTH:
        return `${base} AND CONCAT(MONTH(session_archive.end_date), "/", YEAR(session_archive.end_date)) = activity_report.grouping_value)`;
      case ActivityReportGroupingKeys.OPERATOR:
        return `${base} AND session_archive.operator_id = activity_report.grouping_value)`;
      case ActivityReportGroupingKeys.SITE:
        return `${base} AND session_archive.site_id = activity_report.grouping_value)`;
      default:
        throw new NotAcceptableException('Wrong grouping key passed');
    }
  }
}

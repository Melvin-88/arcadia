import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import {
  CheckingReportAvailabilityInterface,
  PlayerStatsReportInterface,
  PlayerStatsReportsInterface,
} from '../reports/interfaces';
import { PlayerStatsReportEntity } from '../entities';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';
import { PlayerStatsReportGroupingKeys, RoundStatus } from '../enums';

@EntityRepository(PlayerStatsReportEntity)
export class PlayerStatsReportRepository extends Repository<PlayerStatsReportEntity> {
  private buildPlayerStatsReportQuery(): SelectQueryBuilder<PlayerStatsReportEntity> {
    return this.createQueryBuilder('player_stats_report')
      .select('player_stats_report.grouping_value', 'grouping_value')
      .addSelect('SUM(player_stats_report.total_unique_sessions)', 'total_unique_sessions')
      .addSelect('SUM(player_stats_report.total_session_time)', 'total_session_time')
      .addSelect('SUM(player_stats_report.total_rounds_played)', 'total_rounds_played')
      .addSelect('SUM(player_stats_report.total_bets)', 'total_bets')
      .addSelect('SUM(player_stats_report.total_wins)', 'total_wins')
      .addSelect('SUM(player_stats_report.total_behind_bets)', 'total_behind_bets')
      .addSelect('SUM(player_stats_report.total_behind_wins)', 'total_behind_wins')
      .addSelect('SUM(player_stats_report.total_voucher_bets)', 'total_voucher_bets')
      .addSelect('SUM(player_stats_report.total_voucher_wins)', 'total_voucher_wins')
      .addSelect('SUM(player_stats_report.total_refunds)', 'total_refunds')
      .addSelect('SUM(player_stats_report.total_gross_gaming)', 'total_gross_gaming')
      .addSelect('SUM(player_stats_report.total_net_gaming)', 'total_net_gaming')
      .addSelect('SUM(player_stats_report.total_watch_time)', 'total_watch_time')
      .addSelect('MAX(player_stats_report.max_watch_time)', 'max_watch_time')
      .addSelect('SUM(player_stats_report.total_queue_time)', 'total_queue_time')
      .addSelect('MAX(player_stats_report.max_queue_time)', 'max_queue_time')
      .addSelect('SUM(player_stats_report.total_in_play_time)', 'total_in_play_time')
      .addSelect('MAX(player_stats_report.max_in_play_time)', 'max_in_play_time')
      .addSelect('SUM(player_stats_report.total_autoplay_bets)', 'total_autoplay_bets')
      .addSelect('SUM(player_stats_report.total_autoplay_wins)', 'total_autoplay_wins')
      .addSelect('SUM(player_stats_report.total_sessions_watch)', 'total_sessions_watch')
      .addSelect('SUM(player_stats_report.total_sessions_queue)', 'total_sessions_queue')
      .addSelect('SUM(player_stats_report.total_sessions_behind)', 'total_sessions_behind')
      .addSelect('SUM(player_stats_report.total_sessions_in_play)', 'total_sessions_in_play')
      .addSelect('ROUND((SUM(player_stats_report.total_session_time) / SUM(player_stats_report.total_unique_sessions)), 2)', 'avg_session_time')
      .addSelect('ROUND((SUM(player_stats_report.total_rounds_played) / SUM(player_stats_report.total_unique_sessions)), 2)', 'avg_rounds_per_session')
      .addSelect('ROUND((SUM(player_stats_report.total_watch_time) / SUM(player_stats_report.total_unique_sessions)), 2)', 'avg_watch_time')
      .addSelect('ROUND((SUM(player_stats_report.total_queue_time) / SUM(player_stats_report.total_unique_sessions)), 2)', 'avg_queue_time')
      .addSelect('ROUND((SUM(player_stats_report.total_in_play_time) / SUM(player_stats_report.total_unique_sessions)), 2)', 'avg_in_play_time')
      .addSelect('ROUND(((SUM(player_stats_report.total_autoplay_sessions) / SUM(player_stats_report.total_unique_sessions)) * 100), 2)', 'percent_autoplay_sessions')
      .addSelect('ROUND(((SUM(player_stats_report.total_sessions_watch) / SUM(player_stats_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_watch')
      .addSelect('ROUND(((SUM(player_stats_report.total_sessions_queue) / SUM(player_stats_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_queue')
      .addSelect('ROUND(((SUM(player_stats_report.total_sessions_behind) / SUM(player_stats_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_behind')
      .addSelect('ROUND(((SUM(player_stats_report.total_sessions_in_play) / SUM(player_stats_report.total_unique_sessions)) * 100), 2)', 'percent_sessions_in_play')
      .addSelect(`(SELECT SUM(bet) - SUM(wins) - SUM(IF(round.status = '${RoundStatus.TERMINATED}', round.bet, 0)) FROM round_archive round LEFT JOIN session_archive session ON round.session_id = session.id WHERE session.player_cid = player_stats_report.grouping_value)`, 'ltv');
  }

  public async getPlayerStatsReport(filters: any): Promise<PlayerStatsReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildPlayerStatsReportQuery()
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('player_stats_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('player_stats_report.grouping_value IS NOT NULL')
      .groupBy('player_stats_report.grouping_value')
      .orderBy(filters.sortBy || PlayerStatsReportGroupingKeys.PLAYER, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('player_stats_report')
      .select('COUNT(DISTINCT player_stats_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('player_stats_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('player_stats_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): PlayerStatsReportInterface => ({
        grouping_value: item.grouping_value,
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
        ltv: Number(item.ltv),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('player_stats_report')
      .select('player_stats_report.date', 'date')
      .addSelect('player_stats_report.is_completed', 'isCompleted')
      .addSelect('player_stats_report.grouping_key', 'groupingKey')
      .addSelect('player_stats_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('player_stats_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
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
}

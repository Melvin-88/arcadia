import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import {
  CheckingReportAvailabilityInterface,
  PlayerBlocksReportInterface,
  PlayerBlocksReportsInterface,
} from '../reports/interfaces';
import { PlayerBlocksReportEntity } from '../entities';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';
import { PlayerBlocksReportGroupingKeys } from '../enums';

@EntityRepository(PlayerBlocksReportEntity)
export class PlayerBlocksReportRepository extends Repository<PlayerBlocksReportEntity> {
  private buildPlayerBlocksReportQuery(filters: any): SelectQueryBuilder<PlayerBlocksReportEntity> {
    return this.createQueryBuilder('player_blocks_report')
      .select(filters.groupBy === PlayerBlocksReportGroupingKeys.OPERATOR
        ? 'CAST(player_blocks_report.grouping_value AS DOUBLE)'
        : 'player_blocks_report.grouping_value', 'grouping_value')
      .addSelect('SUM(player_blocks_report.total_blocked)', 'total_blocked')
      .addSelect('SUM(player_blocks_report.total_unblocked)', 'total_unblocked');
  }

  public async getPlayerBlocksReport(filters: any): Promise<PlayerBlocksReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildPlayerBlocksReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('player_blocks_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('player_blocks_report.grouping_value IS NOT NULL')
      .groupBy('player_blocks_report.grouping_value')
      .orderBy(filters.sortBy || PlayerBlocksReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('player_blocks_report')
      .select('COUNT(DISTINCT player_blocks_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('player_blocks_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('player_blocks_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): PlayerBlocksReportInterface => ({
        grouping_value: item.grouping_value,
        total_blocked: Number(item.total_blocked),
        total_unblocked: Number(item.total_unblocked),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('player_blocks_report')
      .select('player_blocks_report.date', 'date')
      .addSelect('player_blocks_report.is_completed', 'isCompleted')
      .addSelect('player_blocks_report.grouping_key', 'groupingKey')
      .addSelect('player_blocks_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('player_blocks_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
      .getRawMany();

    const days = getDaysBetweenDates(params.startDate, params.endDate);

    const daysToCreate = _.difference(
      days,
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

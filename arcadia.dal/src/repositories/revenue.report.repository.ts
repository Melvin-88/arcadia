import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NotAcceptableException } from '@nestjs/common';
import {
  CheckingReportAvailabilityInterface,
  RevenueReportInterface,
  RevenueReportsInterface,
} from '../reports/interfaces';
import { RevenueReportEntity } from '../entities';
import { getDaysBetweenDates, omitReportParams } from '../utils';
import { RevenueReportGroupingKeys } from '../enums';

@EntityRepository(RevenueReportEntity)
export class RevenueReportRepository extends Repository<RevenueReportEntity> {
  private buildRevenueReportQuery(filters: any): SelectQueryBuilder<RevenueReportEntity> {
    const totalUniquePlayersSubQuery = this.getTotalUniquePlayersSubQuery(filters.groupBy, filters.startDate, filters.endDate);

    return this.createQueryBuilder('revenue_report')
      .select(filters.groupBy === RevenueReportGroupingKeys.DAY
      || filters.groupBy === RevenueReportGroupingKeys.MONTH
      || filters.groupBy === RevenueReportGroupingKeys.CURRENCY
        ? 'revenue_report.grouping_value'
        : 'CAST(revenue_report.grouping_value AS DOUBLE)', 'grouping_value')
      .addSelect(totalUniquePlayersSubQuery, 'total_unique_players')
      .addSelect('SUM(revenue_report.total_new_players)', 'total_new_players')
      .addSelect('SUM(revenue_report.total_bets)', 'total_bets')
      .addSelect('SUM(revenue_report.total_wins)', 'total_wins')
      .addSelect('SUM(revenue_report.total_voucher_bets)', 'total_voucher_bets')
      .addSelect('SUM(revenue_report.total_voucher_wins)', 'total_voucher_wins')
      .addSelect('SUM(revenue_report.total_refunds)', 'total_refunds')
      .addSelect('SUM(revenue_report.total_gross_gaming)', 'total_gross_gaming')
      .addSelect('SUM(revenue_report.total_net_gaming)', 'total_net_gaming')
      .addSelect(`ROUND((SUM(revenue_report.total_net_gaming) / ${totalUniquePlayersSubQuery}), 2)`, 'arpu');
  }

  public async getRevenueReport(filters: any): Promise<RevenueReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildRevenueReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('revenue_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('revenue_report.grouping_value IS NOT NULL')
      .groupBy('revenue_report.grouping_value')
      .orderBy(filters.sortBy || RevenueReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('revenue_report')
      .select('COUNT(DISTINCT revenue_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('revenue_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('revenue_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): RevenueReportInterface => ({
        grouping_value: item.grouping_value,
        total_unique_players: Number(item.total_unique_players),
        total_new_players: Number(item.total_new_players),
        total_bets: Number(item.total_bets),
        total_wins: Number(item.total_wins),
        total_voucher_bets: Number(item.total_voucher_bets),
        total_voucher_wins: Number(item.total_voucher_wins),
        total_refunds: Number(item.total_refunds),
        total_gross_gaming: Number(item.total_gross_gaming),
        total_net_gaming: Number(item.total_net_gaming),
        arpu: Number(item.arpu),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('revenue_report')
      .select('revenue_report.date', 'date')
      .addSelect('revenue_report.is_completed', 'isCompleted')
      .addSelect('revenue_report.grouping_key', 'groupingKey')
      .addSelect('revenue_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('revenue_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
      .getRawMany();

    const daysToCreate = _.difference(
      getDaysBetweenDates(params.startDate, params.endDate),
      data.map(item => moment(item.date).format('YYYY-MM-DD')),
    );

    const inProgressCount = data.filter(item => !item.groupingValue && !item.groupingKey).length;

    return {
      info: {
        available: data.length - inProgressCount,
        inProgress: inProgressCount,
        toCreate: daysToCreate.length,
      },
      daysToCreate,
    };
  }

  private getTotalUniquePlayersSubQuery(groupingKey: RevenueReportGroupingKeys, startDate: string, endDate: string): string {
    const base = '(SELECT COUNT(DISTINCT session_archive.player_cid) FROM session_archive '
      + `WHERE CAST(session_archive.end_date AS DATE) BETWEEN CAST('${startDate}' AS DATE) AND CAST('${endDate}' AS DATE) `;
    switch (groupingKey) {
      case RevenueReportGroupingKeys.DAY:
        return `${base} AND CAST(session_archive.end_date AS DATE) = CAST(revenue_report.grouping_value AS DATE))`;
      case RevenueReportGroupingKeys.DENOMINATION:
        return `${base} AND session_archive.denominator = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.GROUP:
        return `${base} AND session_archive.group_id = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.MACHINE:
        return `${base} AND session_archive.machine_id = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.MONTH:
        return `${base} AND CONCAT(MONTH(session_archive.end_date), "/", YEAR(session_archive.end_date)) = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.OPERATOR:
        return `${base} AND session_archive.operator_id = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.SITE:
        return `${base} AND session_archive.site_id = revenue_report.grouping_value)`;
      case RevenueReportGroupingKeys.CURRENCY:
        return `${base} AND session_archive.currency = revenue_report.grouping_value)`;
      default:
        throw new NotAcceptableException('Wrong grouping key passed');
    }
  }
}

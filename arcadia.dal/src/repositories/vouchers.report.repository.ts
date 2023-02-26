import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import { VouchersReportEntity } from '../entities';
import {
  VouchersReportInterface,
  VoucherReportsInterface,
  CheckingReportAvailabilityInterface,
} from '../reports/interfaces';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';
import { VouchersReportGroupingKeys } from '../enums';

@EntityRepository(VouchersReportEntity)
export class VouchersReportRepository extends Repository<VouchersReportEntity> {
  private buildVouchersReportQuery(filters: any): SelectQueryBuilder<VouchersReportEntity> {
    return this.createQueryBuilder('vouchers_report')
      .select(filters.groupBy === VouchersReportGroupingKeys.OPERATOR || filters.groupBy === VouchersReportGroupingKeys.DENOMINATION
        ? 'CAST(vouchers_report.grouping_value AS DOUBLE)'
        : 'vouchers_report.grouping_value', 'grouping_value')
      .addSelect('SUM(vouchers_report.total_vouchers_issued)', 'total_vouchers_issued')
      .addSelect('SUM(vouchers_report.total_vouchers_used)', 'total_vouchers_used')
      .addSelect('SUM(vouchers_report.total_vouchers_bets)', 'total_vouchers_bets')
      .addSelect('SUM(vouchers_report.total_vouchers_wins)', 'total_vouchers_wins')
      .addSelect('SUM(vouchers_report.total_vouchers_expired)', 'total_vouchers_expired')
      .addSelect('SUM(vouchers_report.total_vouchers_canceled)', 'total_vouchers_canceled')
      .addSelect('SUM(vouchers_report.total_rounds_played)', 'total_rounds_played');
  }

  public async getVouchersReport(filters: any): Promise<VoucherReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildVouchersReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('vouchers_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('vouchers_report.grouping_value IS NOT NULL')
      .groupBy('vouchers_report.grouping_value')
      .orderBy(filters.sortBy || VouchersReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('vouchers_report')
      .select('COUNT(DISTINCT vouchers_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('vouchers_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('vouchers_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): VouchersReportInterface => ({
        grouping_value: item.grouping_value,
        total_vouchers_issued: Number(item.total_vouchers_issued),
        total_vouchers_used: Number(item.total_vouchers_used),
        total_vouchers_bets: Number(item.total_vouchers_bets),
        total_vouchers_wins: Number(item.total_vouchers_wins),
        total_vouchers_expired: Number(item.total_vouchers_expired),
        total_vouchers_canceled: Number(item.total_vouchers_canceled),
        total_rounds_played: Number(item.total_rounds_played),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('vouchers_report')
      .select('vouchers_report.date', 'date')
      .addSelect('vouchers_report.is_completed', 'isCompleted')
      .addSelect('vouchers_report.grouping_key', 'groupingKey')
      .addSelect('vouchers_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('vouchers_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
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

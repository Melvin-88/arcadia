import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  CheckingReportAvailabilityInterface,
  RetentionReportInterface,
  RetentionReportsInterface,
} from '../reports/interfaces';
import { RetentionReportEntity } from '../entities';
import { getDaysBetweenDates, omitReportParams } from '../utils';
import { RetentionReportGroupingKeys } from '../enums';

@EntityRepository(RetentionReportEntity)
export class RetentionReportRepository extends Repository<RetentionReportEntity> {
  private buildRetentionReportQuery(filters: any): SelectQueryBuilder<RetentionReportEntity> {
    return this.createQueryBuilder('retention_report')
      .select(filters.groupBy === RetentionReportGroupingKeys.OPERATOR || filters.groupBy === RetentionReportGroupingKeys.DENOMINATION
        ? 'CAST(retention_report.grouping_value AS DOUBLE)'
        : 'retention_report.grouping_value', 'grouping_value')
      .addSelect('SUM(retention_report.r1)', 'r1')
      .addSelect('SUM(retention_report.r2)', 'r2')
      .addSelect('SUM(retention_report.r7)', 'r7')
      .addSelect('SUM(retention_report.r14)', 'r14')
      .addSelect('SUM(retention_report.r30)', 'r30');
  }

  public async getRetentionsReport(filters: any): Promise<RetentionReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildRetentionReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('retention_report.params_hash = :paramsHash',
        { paramsHash: objectHash(omitReportParams(filters)) })
      .andWhere('retention_report.grouping_value IS NOT NULL')
      .groupBy('retention_report.grouping_value')
      .orderBy(filters.sortBy || RetentionReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('retention_report')
      .select('COUNT(DISTINCT retention_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('retention_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('retention_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): RetentionReportInterface => ({
        grouping_value: item.grouping_value,
        r1: Number(item.r1),
        r2: Number(item.r2),
        r7: Number(item.r7),
        r14: Number(item.r14),
        r30: Number(item.r30),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('retention_report')
      .select('retention_report.date', 'date')
      .addSelect('retention_report.is_completed', 'isCompleted')
      .addSelect('retention_report.grouping_key', 'groupingKey')
      .addSelect('retention_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('retention_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
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
}
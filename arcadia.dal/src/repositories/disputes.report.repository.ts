import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  CheckingReportAvailabilityInterface,
  DisputesReportInterface,
  DisputesReportsInterface,
} from '../reports/interfaces';
import { DisputesReportEntity } from '../entities';
import { getDaysBetweenDates, omitReportParams } from '../utils';
import { DisputesReportGroupingKeys } from '../enums';

@EntityRepository(DisputesReportEntity)
export class DisputesReportRepository extends Repository<DisputesReportEntity> {
  private buildDisputesReportQuery(filters: any): SelectQueryBuilder<DisputesReportEntity> {
    return this.createQueryBuilder('disputes_report')
      .select(filters.groupBy === DisputesReportGroupingKeys.OPERATOR
        ? 'CAST(disputes_report.grouping_value AS DOUBLE)'
        : 'disputes_report.grouping_value', 'grouping_value')
      .addSelect('SUM(disputes_report.total_dispute_count)', 'total_dispute_count');
  }

  public async getDisputesReport(filters: any): Promise<DisputesReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildDisputesReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('disputes_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('disputes_report.grouping_value IS NOT NULL')
      .groupBy('disputes_report.grouping_value')
      .orderBy(filters.sortBy || DisputesReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('disputes_report')
      .select('COUNT(DISTINCT disputes_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('disputes_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('disputes_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): DisputesReportInterface => ({
        grouping_value: item.grouping_value,
        total_dispute_count: item.total_dispute_count,
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('disputes_report')
      .select('disputes_report.date', 'date')
      .addSelect('disputes_report.is_completed', 'isCompleted')
      .addSelect('disputes_report.grouping_key', 'groupingKey')
      .addSelect('disputes_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('disputes_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
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

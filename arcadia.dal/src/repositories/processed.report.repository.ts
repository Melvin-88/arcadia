import { EntityRepository, Repository } from 'typeorm';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import { ProcessedReportEntity } from '../entities';
import { ReportStatus, ReportTypes } from '../enums';
import { ReportInfoInterface } from '../reports/interfaces/report.info.interface';
import { Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(ProcessedReportEntity)
export class ProcessedReportRepository extends Repository<ProcessedReportEntity> {
  public async getReportsInfo(reportType: ReportTypes, filters: any): Promise<{ data: ReportInfoInterface[], total: number }> {
    let sortParam: Sort = { sort: 'create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, ['requestedDateTime'], filters.sortBy, filters.sortOrder);
    }

    const data = await this.createQueryBuilder()
      .select('report_type', 'reportType')
      .addSelect('params', 'params')
      .addSelect('status', 'status')
      .addSelect('create_date', 'requestedDateTime')
      .where('report_type = :reportType', { reportType })
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .addOrderBy(sortParam.sort, sortParam.order)
      .getRawMany();

    const total = await this.createQueryBuilder()
      .where('report_type = :reportType', { reportType })
      .getCount();

    return {
      data: data.map(item => {
        item.params = JSON.parse(item.params);

        return item;
      }),
      total,
    };
  }

  public saveReportInfoRecord(reportType: ReportTypes, params: any, status: ReportStatus): Promise<ProcessedReportEntity> {
    return this.save({
      reportType,
      params,
      paramsHash: objectHash(_.omit(params, ['take', 'offset', 'sortBy', 'sortOrder'])),
      status,
    });
  }
}

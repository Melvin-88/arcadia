import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { AlertEntity } from '../entities';
import { Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(AlertEntity)
export class AlertRepository extends Repository<AlertEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<AlertEntity>): void {
    queryBuilder.where('');
    if (filters.id) {
      queryBuilder.andWhere('alert.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('alert.status IN (:status)', { status: filters.status });
    }
    if (filters.type) {
      queryBuilder.andWhere('alert.type IN (:type)', { type: filters.type });
    }
    if (filters.isFlagged) {
      queryBuilder.andWhere('alert.is_flagged = :isFlagged', { isFlagged: filters.isFlagged });
    }
    if (filters.severity) {
      queryBuilder.andWhere('alert.severity IN (:severity)', { severity: filters.severity });
    }
    if (filters.source) {
      queryBuilder.andWhere('alert.source LIKE :source', { source: `%${filters.source}%` });
    }
    if (filters.dateFrom) {
      queryBuilder.andWhere('alert.create_date >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      queryBuilder.andWhere('alert.create_date <= :dateTo', { dateTo: filters.dateTo });
    }
    if (filters.description) {
      queryBuilder.andWhere('alert.description LIKE :description', { description: `%${filters.description}%` });
    }
    if (filters.maintenanceRequired) {
      queryBuilder.andWhere('JSON_EXTRACT(additional_information, \'$.maintenanceRequired\') = true');
    }
    queryBuilder.andWhere('alert.is_deleted = false');
  }

  public async getAllAlerts(filters: any): Promise<[AlertEntity[], number]> {
    let sortParam: Sort = { sort: 'alert.create_date', order: 'DESC' };
    if (filters.sortBy) {
      if (filters.sortBy === 'date') {
        filters.sortBy = 'createDate';
      }
      sortParam = setSorting(this, [], filters.sortBy, filters.sortOrder);
    }
    const alertsQuery = this.createQueryBuilder('alert')
      .select();

    this.buildWhereString(filters, alertsQuery);

    if (!filters.sortBy) {
      alertsQuery.addOrderBy('alert.is_flagged', 'DESC');
      alertsQuery.addOrderBy('CASE alert.severity WHEN \'low\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'high\' THEN 3 END', 'DESC');
    }

    const alerts = await alertsQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getMany();

    const countQuery = this.createQueryBuilder('alert')
      .select('COUNT(*)', 'count');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [alerts, parseInt(count.count, 10)];
  }

  public async getLatestAlerts(): Promise<any> {
    return this.createQueryBuilder('alert')
      .select('alert.create_date', 'date')
      .addSelect('alert.description', 'alert')
      .addSelect('alert.severity', 'severity')
      .addSelect('alert.type', 'type')
      .addOrderBy('alert.create_date', 'DESC')
      .where('alert.status = \'active\'')
      .limit(10)
      .getRawMany();
  }
}

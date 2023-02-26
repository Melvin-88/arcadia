import {
  Brackets, EntityRepository, Repository, SelectQueryBuilder,
} from 'typeorm';
import { PerformanceIndicatorEntity, PerformanceTrackerEntity } from '../entities';
import { PerformanceIndicatorInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(PerformanceIndicatorEntity)
export class PerformanceIndicatorRepository extends Repository<PerformanceIndicatorEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<PerformanceIndicatorEntity>): void {
    if (filters.id) {
      queryBuilder.andWhere('performanceIndicator.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('performanceIndicator.status IN (:status)', { status: filters.status });
    }
    if (filters.segment) {
      queryBuilder.andWhere('performanceIndicator.segment = :segment', { segment: filters.segment });
    }
    if (filters.segmentSubsetGroup) {
      queryBuilder.andWhere('JSON_EXTRACT(sub_segment, \'$.group\') = :subsetGroup',
        { subsetGroup: parseInt(filters.segmentSubsetGroup, 10) });
    }
    if (filters.segmentSubsetOperator) {
      queryBuilder.andWhere('JSON_EXTRACT(sub_segment, \'$.operator\') = :subsetOperator',
        { subsetOperator: parseInt(filters.segmentSubsetOperator, 10) });
    }
    if (filters.segmentSubsetMachine) {
      queryBuilder.andWhere('JSON_EXTRACT(sub_segment, \'$.machine\') = :subsetMachine',
        { subsetMachine: parseInt(filters.segmentSubsetMachine, 10) });
    }
    if (filters.mode) {
      queryBuilder.andWhere('mode = :mode', { mode: filters.mode });
    }
    if (filters.metric) {
      queryBuilder.andHaving('metric IN (:metric)', { metric: filters.metric });
    }
    if (filters.dimension) {
      queryBuilder.andWhere('`dimensionTable`.name IN (:dimension)', { dimension: filters.dimension });
    }
    if (filters.targetValueFrom) {
      queryBuilder.andWhere('performanceIndicator.targetValue >= :targetValueFrom', { targetValueFrom: filters.targetValueFrom });
    }
    if (filters.targetValueTo) {
      queryBuilder.andWhere('performanceIndicator.targetValue <= :targetValueTo', { targetValueTo: filters.targetValueTo });
    }
    if (filters.currentValueFrom) {
      queryBuilder.andWhere('`trackersTable`.value >= :currentValueFrom', { currentValueFrom: filters.currentValueFrom });
    }
    if (filters.currentValueTo) {
      queryBuilder.andWhere('`trackersTable`.value <= :currentValueTo', { currentValueTo: filters.currentValueTo });
    }
    queryBuilder.andWhere('performanceIndicator.is_deleted = false');
  }
  private buildQuery(): SelectQueryBuilder<PerformanceIndicatorEntity> {
    return this.createQueryBuilder('performanceIndicator')
      .select('performanceIndicator.id', 'id')
      .leftJoin('performanceIndicator.metric', 'metricTable')
      .leftJoin('performanceIndicator.dimension', 'dimensionTable')
      .leftJoin('performanceIndicator.trackers', 'trackersTable')
      .addSelect('performanceIndicator.status', 'status')
      .addSelect('performanceIndicator.segment', 'segment')
      .addSelect('performanceIndicator.sub_segment', 'segmentSubset')
      .addSelect('performanceIndicator.mode', 'mode')
      .addSelect('metricTable.name', 'metric')
      .addSelect('dimensionTable.name', 'dimension')
      .addSelect('performanceIndicator.target_value', 'targetValue')
      .addSelect('performanceIndicator.alert_low_threshold', 'alertLowThreshold')
      .addSelect('performanceIndicator.alert_high_threshold', 'alertHighThreshold')
      .addSelect('performanceIndicator.cutoff_low_threshold', 'cutoffLowThreshold')
      .addSelect('performanceIndicator.cutoff_high_threshold', 'cutoffHighThreshold');
  }

  public async getAllIndicators(filters: any): Promise<[PerformanceIndicatorInterface[], number]> {
    let sortParam: Sort = { sort: 'performanceIndicator.create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, ['currentValue'],
        filters.sortBy, filters.sortOrder);
    }
    const indicatorsQuery = this.buildQuery();
    this.buildWhereString(filters, indicatorsQuery);
    const indicators = await indicatorsQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .addGroupBy('performanceIndicator.id')
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    indicators.forEach(i => {
      i.segmentSubset = JSON.parse(i.segmentSubset);
    });

    const countQuery = this.createQueryBuilder('performanceIndicator')
      .select('performanceIndicator.id', 'id')
      .leftJoin('performanceIndicator.metric', 'metricTable')
      .leftJoin('performanceIndicator.dimension', 'dimensionTable')
      .leftJoin('performanceIndicator.trackers', 'trackersTable')
      .addSelect('COUNT(DISTINCT performanceIndicator.id)', 'count')
      .addSelect('dimensionTable.name', 'dimension')
      .addSelect('metricTable.name', 'metric')
      .addGroupBy('performanceIndicator.id');

    this.buildWhereString(filters, countQuery);

    const countRaw = await countQuery.getRawMany();
    const count = countRaw.length;

    return [indicators, count];
  }
}

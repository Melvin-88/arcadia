import { EntityRepository, Repository } from 'typeorm';
import { PerformanceMetricEntity } from '../entities';

@EntityRepository(PerformanceMetricEntity)
export class PerformanceMetricRepository extends Repository<PerformanceMetricEntity> {}

import { EntityRepository, Repository } from 'typeorm';
import { PerformanceTrackerEntity } from '../entities';

@EntityRepository(PerformanceTrackerEntity)
export class PerformanceTrackerRepository extends Repository<PerformanceTrackerEntity> {}

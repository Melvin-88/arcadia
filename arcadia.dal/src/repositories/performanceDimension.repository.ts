import { EntityRepository, Repository } from 'typeorm';
import { PerformanceDimensionEntity } from '../entities';

@EntityRepository(PerformanceDimensionEntity)
export class PerformanceDimensionRepository extends Repository<PerformanceDimensionEntity> {}

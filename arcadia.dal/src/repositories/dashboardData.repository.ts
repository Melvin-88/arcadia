import { EntityRepository, Repository } from 'typeorm';
import { DashboardDataEntity } from '../entities';

@EntityRepository(DashboardDataEntity)
export class DashboardDataRepository extends Repository<DashboardDataEntity> {}

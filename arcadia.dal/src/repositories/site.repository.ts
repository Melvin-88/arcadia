import { EntityRepository, Repository } from 'typeorm';
import { SiteEntity } from '../entities';

@EntityRepository(SiteEntity)
export class SiteRepository extends Repository<SiteEntity> {
}

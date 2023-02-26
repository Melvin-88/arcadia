import { EntityRepository, Repository } from 'typeorm';
import { RoundArchiveEntity } from '../entities';

@EntityRepository(RoundArchiveEntity)
export class RoundArchiveRepository extends Repository<RoundArchiveEntity> {

}

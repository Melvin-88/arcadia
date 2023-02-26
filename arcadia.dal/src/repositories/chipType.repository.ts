import { EntityRepository, Repository } from 'typeorm';
import { ChipTypeEntity } from '../entities';

@EntityRepository(ChipTypeEntity)
export class ChipTypeRepository extends Repository<ChipTypeEntity> {
}

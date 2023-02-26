import { EntityRepository, Repository } from 'typeorm';
import { ActionEntity } from '../entitiesAudit';

@EntityRepository(ActionEntity)
export class ActionRepository extends Repository<ActionEntity> {
}

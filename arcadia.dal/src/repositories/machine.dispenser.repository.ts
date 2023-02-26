import { EntityRepository, Repository } from 'typeorm';
import { MachineDispenserEntity } from '../entities';

@EntityRepository(MachineDispenserEntity)
export class MachineDispenserRepository extends Repository<MachineDispenserEntity> {
}

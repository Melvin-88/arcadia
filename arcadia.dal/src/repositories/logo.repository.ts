import { EntityRepository, Repository } from 'typeorm';
import { LogoEntity } from '../entities';

@EntityRepository(LogoEntity)
export class LogoRepository extends Repository<LogoEntity> {
}

import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { BoModulesEntity } from '../entities';

@EntityRepository(BoModulesEntity)
export class BoModuleRepository extends Repository<BoModulesEntity> {
  private buildQuery(): SelectQueryBuilder<BoModulesEntity> {
    return this.createQueryBuilder('bo_module')
      .select('bo_module.id', 'id')
      .addSelect('bo_module.name', 'name')
      .addSelect('bo_module.description', 'description')
      .addSelect('bo_module.tag', 'tag');
  }

  public async getAllBoModules(): Promise<BoModulesEntity[]> {
    return this.buildQuery().getRawMany();
  }
}

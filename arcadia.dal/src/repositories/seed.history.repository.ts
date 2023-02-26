import { EntityRepository, MoreThan, Repository } from 'typeorm';

import { SeedHistoryEntity } from '../entities';

@EntityRepository(SeedHistoryEntity)
export class SeedHistoryRepository extends Repository<SeedHistoryEntity> {
  public getSeedHistory(machineId: number, fromDate: Date): Promise<SeedHistoryEntity[]> {
    return this.find({
      machineId,
      createDate: MoreThan(fromDate),
      isDeleted: false,
    });
  }
}

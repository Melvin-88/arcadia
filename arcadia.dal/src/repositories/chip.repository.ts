import * as _ from 'lodash';
import * as moment from 'moment';
import { EntityRepository, Repository } from 'typeorm';
import { ChipEntity, PerformanceIndicatorEntity } from '../entities';
import { ChipStatus, PerformanceIndicatorSegment } from '../enums';
import { ChipInterface } from '../interfaces';

@EntityRepository(ChipEntity)
export class ChipRepository extends Repository<ChipEntity> {
  public getChipMapForEmul(types: string[], siteId: number): Promise<ChipEntity[]> {
    return this.createQueryBuilder('chip')
      .leftJoinAndSelect('chip.type', 'chipType')
      .where('chip.site_id = :siteId', { siteId })
      .andWhere('chip.machine_id IS NULL')
      .andWhere('chipType.name IN (:...types)', { types })
      .andWhere('chip.is_deleted = 0')
      .andWhere('chip.status = :status', { status: 'active' })
      .getMany();
  }

  public async findChipsByMachineId(id: number): Promise<ChipEntity[]> {
    return this.createQueryBuilder('chip')
      .leftJoin('chip.type', 'chipType')
      .select('chip.rfid')
      .addSelect('chip.value')
      .addSelect('chipType.name')
      .addSelect('chipType.id')
      .addSelect('chipType.sound_id')
      .andWhere('chip.machine_id = :id', { id })
      .andWhere('chip.is_deleted = false')
      .getMany();
  }

  public async findChipsByRfidTerm(term: string): Promise<ChipInterface[]> {
    return this.createQueryBuilder('chip')
      .select('chip.rfid', 'rfid')
      .addSelect('chip.value', 'value')
      .addSelect('chip.type_id', 'typeId')
      .addSelect('chip.site_id', 'siteId')
      .addSelect('chip.status', 'status')
      .andWhere('chip.rfid LIKE:like', { like: `%${term}%` })
      .andWhere('chip.is_deleted = false')
      .getRawMany();
  }

  public async getActiveInPlayChipsBySegment(indicator: PerformanceIndicatorEntity): Promise<_.Dictionary<ChipEntity[]>> {
    const chipsQuery = await this.createQueryBuilder('chip')
      .leftJoinAndSelect('chip.machine', 'machine')
      .leftJoinAndSelect('machine.group', 'group')
      .leftJoinAndSelect('group.operators', 'o')
      .where('chip.update_date > :date', { date: moment().subtract(indicator.dimension.value, 'minute').toISOString() })
      .andWhere('chip.status = :status', { status: ChipStatus.ACTIVE })
      .andWhere('chip.machine_id IS NOT NULL');

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          chipsQuery.andWhere('group.id = :groupId', { groupId: indicator.subSegment.group });
        }
        break;
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          chipsQuery.andWhere('machine.id = :machineId', { machineId: indicator.subSegment.machine });
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          chipsQuery.andWhere('o.id = :operatorId', { operatorId: indicator.subSegment.operator });
        }
        break;
      default:
    }

    const chips = await chipsQuery.getMany();
    return _.groupBy(chips, chip => chip.machine.serial);
  }
}

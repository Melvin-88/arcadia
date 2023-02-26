import { EntityRepository, Repository } from 'typeorm';
import { RngChipPrizeEntity } from '../entities';

@EntityRepository(RngChipPrizeEntity)
export class RngChipPrizeRepository extends Repository<RngChipPrizeEntity> {
  public getChipPrize(group: string, chipTypeId: number, rtpSegment: string = null): Promise<RngChipPrizeEntity | undefined> {
    const builder = this.createQueryBuilder('prize')
      .where('prize.group = :group', { group })
      .andWhere('prize.chip_type_id = :chipTypeId', { chipTypeId });
    if (rtpSegment === null) {
      builder.andWhere('prize.rtp_segment IS NULL');
    } else {
      builder.andWhere('prize.rtp_segment = :rtpSegment', { rtpSegment });
    }
    return builder.getOne();
  }

  public getAllPrizes(group: string, rtpSegment: string = null): Promise<RngChipPrizeEntity[]> {
    const builder = this.createQueryBuilder('prize')
      .leftJoinAndSelect('prize.chipType', 'type')
      .where('prize.group = :group', { group });
    if (rtpSegment === null) {
      builder.andWhere('prize.rtp_segment IS NULL');
    } else {
      builder.andWhere('prize.rtp_segment = :rtpSegment', { rtpSegment });
    }
    return builder.getMany();
  }

  public async getAllPrizeGroups(): Promise<string[]> {
    const queryBuilder = this.createQueryBuilder('prize')
      .select('prize.group', 'group')
      .distinct(true);

    const rawPrizes = await queryBuilder.getRawMany();
    return rawPrizes.map(prize => prize.group);
  }

  public async getPayTable(
    conversionRate: number, prizeGroup: string, rtpSegment?: string,
  ): Promise<{ type: string; currencyValue: number; soundId: string; iconId: string; }[]> {
    const builder = this.createQueryBuilder('p')
      .leftJoin('p.chipType', 't')
      .select('p.chip_value', 'currencyValue')
      .addSelect('t.sound_id', 'soundId')
      .addSelect('t.icon_id', 'iconId')
      .addSelect('t.name', 'type')
      .where('p.group = :prizeGroup', { prizeGroup });
    if (rtpSegment) {
      builder.andWhere('p.rtp_segment = :rtpSegment', { rtpSegment });
    } else {
      builder.andWhere('p.rtp_segment IS NULL');
    }
    const results = await builder
      .orderBy('IF(p.chip_value IS NULL, 999999, p.chip_value)', 'ASC')
      .getRawMany();
    return results.map(value => ({
      ...value,
      currencyValue: Number(((parseFloat(value.currencyValue) || 0) * conversionRate)
        .toFixed(2)),
    }));
  }
}

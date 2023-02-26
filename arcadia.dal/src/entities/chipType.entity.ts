import { IsNotEmpty } from 'class-validator';
import {
  Column, Entity, OneToMany, PrimaryColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { ChipEntity } from './chip.entity';
import { MachineDispenserEntity } from './machine.dispenser.entity';
import { RngChipPrizeEntity } from './rng.chip.prize.entity';

@Entity('chip_type')
export class ChipTypeEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'varchar', length: 200 })
  public name: string;

  @Column({ type: 'varchar', length: 200 })
  public soundId: string;

  @Column({ type: 'varchar', length: 128 })
  public iconId: string;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @OneToMany(() => ChipEntity, ChipEntity => ChipEntity.type)
  public chips: ChipEntity[];

  @OneToMany(() => MachineDispenserEntity,
    machineDispenser => machineDispenser.chipType)
  public dispensers: MachineDispenserEntity[];

  @OneToMany(() => RngChipPrizeEntity, inverse => inverse.chipType)
  public rngChipPrizes: RngChipPrizeEntity[];
}

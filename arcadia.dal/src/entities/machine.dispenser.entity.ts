import { IsNotEmpty } from 'class-validator';
import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { ChipTypeEntity } from './chipType.entity';
import { MachineEntity } from './machine.entity';

@Entity('machine_dispenser')
export class MachineDispenserEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'varchar', length: 100 })
  public name: string;

  @Column({
    type: 'smallint', unsigned: true, default: 0,
  })
  public level: number;

  @Column({
    type: 'smallint', unsigned: true, default: 0,
  })
  public capacity: number;

  @ManyToOne(() => MachineEntity, machineEntity => machineEntity.dispensers, {
    onDelete: 'SET NULL',
  })
  public machine: MachineEntity;

  @ManyToOne(() => ChipTypeEntity, chipTypeEntity => chipTypeEntity.dispensers, {
    onDelete: 'SET NULL',
  })
  public chipType: ChipTypeEntity;
}

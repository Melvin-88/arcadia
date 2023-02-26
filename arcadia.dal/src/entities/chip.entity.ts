import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { ChipStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { NumberTransformer } from '../utils';
import { ChipTypeEntity } from './chipType.entity';
import { MachineEntity } from './machine.entity';
import { SiteEntity } from './site.entity';

@Entity('chip')
export class ChipEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({ type: 'varchar' })
  public rfid: string;

  @ManyToOne(() => ChipTypeEntity, ChipTypeEntity => ChipTypeEntity.chips, {
    onDelete: 'SET NULL',
  })
  public type: ChipTypeEntity;

  @Column({
    type: 'decimal', precision: 6, scale: 2, default: '0.00', transformer: new NumberTransformer(),
  })
  public value: number;

  @ManyToOne(() => SiteEntity, SiteEntity => SiteEntity.chips, {
    onDelete: 'SET NULL',
  })
  public site: SiteEntity;

  @ManyToOne(() => MachineEntity, MachineEntity => MachineEntity.chips, {
    onDelete: 'SET NULL',
  })
  public machine: MachineEntity;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column({ type: 'enum', enum: ChipStatus })
  public status: ChipStatus;

  @Column({ type: 'boolean', default: false })
  public isScatter: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}
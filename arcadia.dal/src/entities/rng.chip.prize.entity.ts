import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { NumberTransformer } from '../utils';
import { ChipTypeEntity } from './chipType.entity';

@Entity('rng_chip_prizes')
@Index(['group', 'chipType', 'rtpSegment'], { unique: true })
export class RngChipPrizeEntity {
  public userLogData: UserLogData;

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 64, default: 'default' })
  public group: string;

  @Column({
    type: 'decimal', precision: 6, scale: 2, nullable: true, transformer: new NumberTransformer(),
  })
  public chipValue: number;

  @Column({
    name: 'rtp100',
    type: 'decimal',
    precision: 4,
    scale: 2,
    unsigned: true,
  })
  public rtp100: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public rtpSegment: string;

  @CreateDateColumn({ name: 'created_datetime', type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ name: 'updated_datetime', type: 'datetime' })
  public updateDate: Date;

  @ManyToOne(() => ChipTypeEntity, inverse => inverse.rngChipPrizes,
    { onDelete: 'SET NULL' })
  public chipType: ChipTypeEntity;
}
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RoundStatus, RoundType } from '../enums';
import { NumberTransformer } from '../utils';

@Entity('round_archive')
export class RoundArchiveEntity {
  @PrimaryColumn({
    type: 'bigint', unsigned: true, unique: true,
  })
  public id: number;

  @Column({ type: 'bigint', unsigned: true, transformer: new NumberTransformer() })
  public sessionId: number;

  @Column({ type: 'bigint', unsigned: true, transformer: new NumberTransformer() })
  public machineId: number;

  @Column({ type: 'enum', enum: RoundType })
  public type: RoundType;

  @Column({ type: 'enum', enum: RoundStatus })
  public status: RoundStatus;

  @Column({
    type: 'tinyint', unsigned: true, default: 0,
  })
  public coins: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public wins: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public winInCash: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public bet: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public betInCash: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public jackpotContribution: number;

  @Column({ type: 'datetime' })
  public startDate: Date;

  @Column({ type: 'datetime' })
  public endDate: Date;

  @Column({ type: 'boolean', default: false })
  public isAutoplay: boolean;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public voucherId: number;
}

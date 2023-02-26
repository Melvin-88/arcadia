import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { RoundStatus, RoundType } from '../enums';
import { UserLogData } from '../interfaces';
import { RtpData } from '../types';
import { NumberTransformer } from '../utils';
import { SessionEntity } from './session.entity';

@Entity('round')
export class RoundEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', {
    unsigned: true,
    generated: 'increment',
  })
  public id: number;

  @Column({ type: 'enum', enum: RoundType, default: RoundType.REGULAR })
  public type: RoundType = RoundType.REGULAR;

  @Column({ type: 'enum', enum: RoundStatus, default: RoundStatus.ACTIVE })
  public status: RoundStatus = RoundStatus.ACTIVE;

  @Column({ type: 'json', nullable: true })
  public rtp: RtpData[];

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

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public endDate: Date;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean = false;

  @ManyToOne(() => SessionEntity, inverse => inverse.rounds, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  public session: SessionEntity;

  @Column({ type: 'bigint', unsigned: true })
  public machineId: number;

  @Column({ type: 'boolean', default: false })
  public isAutoplay: boolean;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public voucherId: number;

  @Column({ type: 'datetime', nullable: true })
  public endDelayUpTo: Date;
}

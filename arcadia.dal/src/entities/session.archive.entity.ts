/* eslint-disable max-lines */
import {
  Column, Entity, Index, OneToMany, PrimaryColumn,
} from 'typeorm';
import { SessionStatus } from '../enums';
import { NumberTransformer } from '../utils';
import { DisputeEntity } from './dispute.entity';

@Entity('session_archive')
export class SessionArchiveEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true, unique: true })
  public id: number;

  @Column({ type: 'varchar', length: 128 })
  public playerCid: string;

  @Column({ type: 'varchar', length: 128 })
  public playerName: string;

  @Column({ type: 'varbinary', length: 16 })
  public playerIP: string | (() => string);

  @Column({ type: 'varchar', length: 32, nullable: true })
  public clientAppVersion: string;

  @Column({ type: 'bigint', unsigned: true })
  public operatorId: number;

  @Column({ type: 'varchar', length: 128 })
  public operatorName: string;

  @Column({ type: 'bigint', unsigned: true })
  public groupId: number;

  @Column({ type: 'varchar', length: 128 })
  public groupName: string;

  @Column({ type: 'bigint', unsigned: true })
  public machineId: number;

  @Column({ type: 'bigint', unsigned: true })
  public siteId: number;

  @Column({ type: 'varchar', length: 64 })
  public machineSerial: string;

  @Column({ type: 'enum', enum: SessionStatus })
  public status: SessionStatus;

  @Column({ type: 'bigint', unsigned: true })
  public queueId: number;

  @Column({ type: 'tinyint', unsigned: true })
  public stackSize: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, unsigned: true, default: '0.00',
  })
  public lastPurchaseAmount: number;

  @Column({ type: 'boolean', default: false })
  public isScatter: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public totalWinning: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public totalWinInCash: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public jackpotWin: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: false,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public totalNetCash: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public totalBets: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public totalBetsInCash: number;

  @Column({ type: 'varchar', length: 1024 })
  public configuration: string;

  @Column({ type: 'varbinary', length: 16, nullable: true })
  public clientApiServerIP: string | (() => string);

  @Column({ type: 'datetime' })
  public startDate: Date;

  @Index()
  @Column({ type: 'datetime' })
  public endDate: Date;

  @OneToMany(() => DisputeEntity, DisputeEntity => DisputeEntity.session)
  public disputes: DisputeEntity[];

  @Column({
    type: 'int', unsigned: true, default: 0,
  })
  public duration: number;

  @Column({
    type: 'smallint', unsigned: true, default: 0,
  })
  public viewerDuration: number;

  @Column({
    type: 'smallint', unsigned: true, default: 0,
  })
  public queueDuration: number;

  @Column({
    type: 'smallint', unsigned: true, default: 0,
  })
  public offlineDuration: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public sessionDescription: string;

  @Column({
    type: 'tinyint', unsigned: true, default: 0,
  })
  public totalStacksUsed: number;

  @Column({ type: 'varchar', length: 3 })
  public currency: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public currencyConversionRate: number;

  @Column({ type: 'varchar', length: 10 })
  public locale: string;

  @Column({ type: 'varchar', length: 64 })
  public os: string;

  @Column({ type: 'varchar', length: 64 })
  public deviceType: string;

  @Column({ type: 'varchar', length: 64 })
  public browser: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public denominator: number;

  @Column({ type: 'boolean', default: false })
  public isDenominationChanged: boolean;
}

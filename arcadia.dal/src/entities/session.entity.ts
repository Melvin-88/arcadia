/* eslint-disable max-lines */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoundStatus, SessionStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { Configuration } from '../types';
import { NumberTransformer } from '../utils';
import { GroupEntity } from './group.entity';
import { MachineEntity } from './machine.entity';
import { OperatorEntity } from './operator.entity';
import { PlayerEntity } from './player.entity';
import { QueueEntity } from './queue.entity';
import { RoundEntity } from './round.entity';
import { VoucherEntity } from './voucher.entity';

@Entity('session')
export class SessionEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', {
    unsigned: true, generated: 'increment',
  })
  public id: number;

  @Column({ type: 'json' })
  public sessionDescription: Record<string, any> = {};

  @Column({ type: 'varbinary', length: 16 })
  public playerIP: string | ((data: any) => string);

  @Column({ type: 'varchar', length: 50 })
  public footprint: string;

  @Column({ type: 'varchar', length: 256 })
  public streamAuthToken: string;

  @Column({ type: 'boolean', default: false })
  public isDisconnected: boolean;

  @Column({
    type: 'int', unsigned: true, nullable: true,
  })
  public offeredQueueId: number;

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
    precision: 6,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public denominator: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public currencyConversionRate: number;

  @Column({
    type: 'tinyint', unsigned: true, default: 0,
  })
  public totalStacksUsed: number;

  @Column({
    type: 'tinyint', unsigned: true, default: 0,
  })
  public pendingScatter: number;

  @Column({
    type: 'tinyint', unsigned: true, default: 0,
  })
  public roundsLeft: number;

  @Column({ type: 'varchar', length: 3 })
  public currency: string;

  @Column({ type: 'varchar', length: 10, default: 'en_US' })
  public locale: string;

  @Column({ type: 'varchar', length: 32 })
  public clientVersion: string;

  @Column({ type: 'varchar', length: 64 })
  public os: string;

  @Column({ type: 'varchar', length: 64 })
  public deviceType: string;

  @Column({ type: 'varchar', length: 64 })
  public browser: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.VIEWER })
  public status: SessionStatus = SessionStatus.VIEWER;

  @Column({ type: 'json' })
  public configuration: Configuration;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean = false;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  public buyDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public lastDisconnectDate: Date;

  @ManyToOne(() => OperatorEntity, inverse => inverse.sessions, { onDelete: 'RESTRICT' })
  public operator: OperatorEntity;

  @ManyToOne(() => GroupEntity, GroupEntity => GroupEntity.sessions, { onDelete: 'RESTRICT' })
  public group: GroupEntity;

  @ManyToOne(() => PlayerEntity, PlayerEntity => PlayerEntity.sessions, { onDelete: 'RESTRICT' })
  public player: PlayerEntity;

  @ManyToOne(() => QueueEntity, queue => queue.sessions, { onDelete: 'RESTRICT' })
  public queue: QueueEntity;

  @ManyToOne(() => MachineEntity, MachineEntity => MachineEntity.sessions, { onDelete: 'RESTRICT' })
  public machine: MachineEntity;

  @OneToMany(() => VoucherEntity, VoucherEntity => VoucherEntity.session)
  public vouchers: VoucherEntity[];

  @OneToMany(() => RoundEntity, inverse => inverse.session)
  public rounds: RoundEntity[];

  @Column({ type: 'boolean', default: false })
  public isDenominationChanged: boolean;

  public isActivePlayingStatus(): boolean {
    return this.status === SessionStatus.PLAYING
      || this.status === SessionStatus.AUTOPLAY
      || this.status === SessionStatus.FORCED_AUTOPLAY
      || this.status === SessionStatus.QUEUE_BET_BEHIND
      || this.status === SessionStatus.VIEWER_BET_BEHIND
      || this.status === SessionStatus.RE_BUY;
  }

  public isEngaged(): boolean {
    return this.status === SessionStatus.PLAYING
      || this.status === SessionStatus.AUTOPLAY
      || this.status === SessionStatus.FORCED_AUTOPLAY
      || this.status === SessionStatus.RE_BUY;
  }

  public getActiveRound(): RoundEntity | undefined {
    return this.rounds?.find(round => round.status === RoundStatus.ACTIVE);
  }

  public willDisengage(): boolean {
    return this.isDisconnected || this.status === SessionStatus.FORCED_AUTOPLAY;
  }
}

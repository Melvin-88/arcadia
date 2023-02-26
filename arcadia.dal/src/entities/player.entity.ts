import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { DisputeEntity } from './dispute.entity';
import { OperatorEntity } from './operator.entity';
import { SessionEntity } from './session.entity';
import { VoucherEntity } from './voucher.entity';

@Entity('player')
export class PlayerEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('varchar', { length: 200 })
  public cid: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public name: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column({ type: 'enum', enum: PlayerStatus, default: PlayerStatus.ACTIVE })
  public status: PlayerStatus = PlayerStatus.ACTIVE;

  @ManyToOne(() => OperatorEntity, OperatorEntity => OperatorEntity.players, {
    onDelete: 'SET NULL',
  })
  public operator: OperatorEntity;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public blockReason: string;

  @Column({
    type: 'decimal', precision: 10, scale: 2, unsigned: true, default: '0.00',
  })
  public bets: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, unsigned: true, default: '0.00',
  })
  public wins: number;

  @Column({ type: 'datetime' })
  public lastSessionDate: Date;

  @Column({ type: 'json' })
  public settings: Record<string, any> = {};

  @OneToMany(() => SessionEntity, SessionEntity => SessionEntity.player)
  public sessions: SessionEntity[];

  @OneToMany(() => VoucherEntity, VoucherEntity => VoucherEntity.player)
  public vouchers: VoucherEntity[];

  @OneToMany(() => DisputeEntity, DisputeEntity => DisputeEntity.player)
  public disputes: DisputeEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

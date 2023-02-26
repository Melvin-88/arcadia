import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoucherStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { GroupEntity } from './group.entity';
import { OperatorEntity } from './operator.entity';
import { PlayerEntity } from './player.entity';
import { SessionEntity } from './session.entity';

@Entity('voucher')
export class VoucherEntity {
  public userLogData: UserLogData;

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  public id: number;

  @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.PENDING })
  public status: VoucherStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public revocationReason: string;

  @Column({ type: 'datetime', nullable: true })
  public expirationDate: Date;

  @ManyToOne(() => OperatorEntity, OperatorEntity => OperatorEntity.vouchers, {
    onDelete: 'SET NULL',
  })
  public operator: OperatorEntity;

  @ManyToOne(() => PlayerEntity, PlayerEntity => PlayerEntity.vouchers, {
    onDelete: 'SET NULL',
  })
  public player: PlayerEntity;

  @ManyToOne(() => GroupEntity, GroupEntity => GroupEntity.vouchers, {
    onDelete: 'SET NULL',
  })
  public group: GroupEntity;

  @ManyToOne(() => SessionEntity, SessionEntity => SessionEntity.vouchers, {
    onDelete: 'SET NULL',
  })
  public session: SessionEntity;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

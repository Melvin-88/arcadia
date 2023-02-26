import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperatorStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { Configuration } from '../types';
import { DisputeEntity } from './dispute.entity';
import { GroupEntity } from './group.entity';
import { PlayerEntity } from './player.entity';
import { SessionEntity } from './session.entity';
import { VoucherEntity } from './voucher.entity';

@Entity('operator')
export class OperatorEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', {
    unsigned: true,
    generated: 'increment',
  })
  public id: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public blueRibbonId: string;

  @Column({ type: 'varchar', length: 128 })
  public voucherPortalUsername: string;

  @Column({ type: 'varchar', length: 250 })
  public voucherPortalPassword: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  public name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public logoUrl: string;

  @Column({ type: 'enum', enum: OperatorStatus, default: OperatorStatus.DISABLED })
  public status: OperatorStatus = OperatorStatus.DISABLED;

  @Column({ type: 'varchar', length: 100 })
  public apiConnectorId: string;

  @Column({ type: 'varchar', length: 100 })
  public apiAccessToken: string;

  @Column({ type: 'datetime' })
  public apiTokenExpirationDate: Date;

  @Column({ type: 'json' })
  public regulation: Record<string, any> = {};

  @ManyToMany(() => GroupEntity, GroupEntity => GroupEntity.operators)
  public groups: GroupEntity[];

  @OneToMany(() => PlayerEntity, PlayerEntity => PlayerEntity.operator)
  public players: PlayerEntity[];

  @OneToMany(() => VoucherEntity, VoucherEntity => VoucherEntity.operator)
  public vouchers: VoucherEntity[];

  @OneToMany(() => DisputeEntity, DisputeEntity => DisputeEntity.operator)
  public disputes: DisputeEntity[];

  @OneToMany(() => SessionEntity, inverse => inverse.operator)
  public sessions: SessionEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'json' })
  public configuration: Configuration = {};
}

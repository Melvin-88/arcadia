import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { Configuration } from '../types';
import { MachineEntity } from './machine.entity';
import { OperatorEntity } from './operator.entity';
import { SessionEntity } from './session.entity';
import { VoucherEntity } from './voucher.entity';

@Entity('group')
export class GroupEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', {
    unsigned: true,
    generated: 'increment',
  })
  public id: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public blueRibbonGameId: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public color: string;

  @Column({ type: 'varchar', length: 200 })
  public name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public denominator: number;

  @Column({ type: 'json' })
  public regulation: Record<string, any> = {};

  @Column({ type: 'json' })
  public configuration: Configuration = {};

  @Column({ type: 'boolean', default: false })
  public isPrivate: boolean;

  @Column({ type: 'smallint', nullable: true })
  public stackSize: number;

  @Column({
    type: 'tinyint', unsigned: true, default: 10,
  })
  public stackBuyLimit: number;

  @Column({ type: 'enum', enum: GroupStatus, default: GroupStatus.OFFLINE })
  public status: GroupStatus;

  @Column({ type: 'tinyint', unsigned: true, default: 30 })
  public idleTimeout: number;

  @Column({ type: 'tinyint', unsigned: true, default: 10 })
  public graceTimeout: number;

  @Column({ type: 'tinyint', unsigned: true, default: 5 })
  public engageTimeout: number;

  @Column({
    type: 'smallint',
    nullable: true,
    comment: 'Number of players in queue alert threshold',
  })
  public numberOfPlayersAlert: number;

  @OneToMany(() => MachineEntity, MachineEntity => MachineEntity.group)
  public machines: MachineEntity[];

  @OneToMany(() => SessionEntity, SessionEntity => SessionEntity.group)
  public sessions: SessionEntity[];

  @Column({ type: 'varchar', length: 64, default: 'default' })
  public prizeGroup: string;

  @OneToMany(() => VoucherEntity, VoucherEntity => VoucherEntity.group)
  public vouchers: VoucherEntity[];

  @ManyToMany(() => OperatorEntity, OperatorEntity => OperatorEntity.groups)
  @JoinTable()
  public operators: OperatorEntity[];

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

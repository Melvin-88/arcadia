import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisputeStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { OperatorEntity } from './operator.entity';
import { PlayerEntity } from './player.entity';
import { SessionArchiveEntity } from './session.archive.entity';

@Entity('dispute')
export class DisputeEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  public status: DisputeStatus;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column({
    type: 'decimal',
    unsigned: true,
    default: '0.00',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  public rebateSum: number;

  @Column({ type: 'varchar', length: 3, nullable: true })
  public rebateCurrency: string;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public closedDate: Date;

  @ManyToOne(() => OperatorEntity, OperatorEntity => OperatorEntity.disputes, {
    onDelete: 'SET NULL',
  })
  public operator: OperatorEntity;

  @ManyToOne(() => PlayerEntity, PlayerEntity => PlayerEntity.disputes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  public player: PlayerEntity;

  @ManyToOne(() => SessionArchiveEntity, SessionArchiveEntity => SessionArchiveEntity.disputes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  public session: SessionArchiveEntity;

  @Column({ type: 'text' })
  public complaint: string;

  @Column({ type: 'text', nullable: true })
  public discussion: string;
}

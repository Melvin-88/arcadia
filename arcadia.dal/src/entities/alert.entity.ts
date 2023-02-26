import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AlertSeverity,
  AlertStatus,
  AlertType,
} from '../enums';
import { UserLogData } from '../interfaces';
import { AlertAdditionalInfo } from '../types/alert.additional.info';

@Entity('alert')
export class AlertEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', { unsigned: true, generated: 'increment' })
  public id: string;

  @Index()
  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE })
  public status: AlertStatus;

  @Column({ type: 'enum', enum: AlertType, default: AlertType.INFORMATION })
  public type: AlertType;

  @Column({ type: 'varchar', length: 32 })
  public source: string;

  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.LOW })
  public severity: AlertSeverity;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column({ type: 'json' })
  public additionalInformation: AlertAdditionalInfo;

  @Column({ type: 'boolean', default: false })
  public isFlagged: boolean;
}

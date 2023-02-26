import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { AlertEntity } from './alert.entity';
import { AlertNotificationServiceEntity } from './alertNotificationService.entity';

@Entity('alert_notification_services')
export class AlertNotificationServicesEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @ManyToOne(() => AlertEntity)
  public alert: AlertEntity;

  @ManyToOne(() => AlertNotificationServiceEntity)
  public alertNotificationService: AlertNotificationServiceEntity;
}
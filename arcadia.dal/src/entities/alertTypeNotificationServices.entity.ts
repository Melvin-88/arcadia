import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { AlertNotificationServiceEntity } from './alertNotificationService.entity';
import { AlertTypeEntity } from './alertType.entity';

@Entity('alert_type_notification_service')
export class AlertTypeNotificationServicesEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('bigint', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @ManyToOne(() => AlertTypeEntity)
  public alertType: AlertTypeEntity;

  @ManyToOne(() => AlertNotificationServiceEntity)
  public alertNotificationService: AlertNotificationServiceEntity;
}

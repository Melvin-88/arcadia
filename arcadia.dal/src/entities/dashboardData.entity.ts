import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';

@Entity('dashboard_data')
export class DashboardDataEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ type: 'json' })
  public data: Record<string, any>;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}
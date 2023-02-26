import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserLogData } from '../interfaces';
import { PerformanceIndicatorEntity } from './performanceIndicator.entity';

@Entity('performance_metric')
export class PerformanceMetricEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({ type: 'varchar', length: 128 })
  public name: string;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'varchar', length: 256 })
  public description: string;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @OneToMany(() => PerformanceIndicatorEntity, PerformanceIndicatorEntity => PerformanceIndicatorEntity.metric)
  public indicators: PerformanceIndicatorEntity[];
}

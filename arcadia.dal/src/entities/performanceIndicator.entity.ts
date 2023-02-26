import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserLogData } from '../interfaces';
import { PerformanceIndicatorMode, PerformanceIndicatorSegment, PerformanceIndicatorStatus } from '../enums';
import { PerformanceMetricEntity } from './performanceMetric.entity';
import { PerformanceDimensionEntity } from './performanceDimension.entity';
import { PerformanceTrackerEntity } from './performanceTracker.entity';
import { PerformanceIndicatorSubsegment } from '../types';

@Entity('performance_indicator')
export class PerformanceIndicatorEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({
    type: 'smallint', unsigned: true, generated: 'increment',
  })
  public id: number;

  @Column({
    type: 'enum',
    enum: PerformanceIndicatorStatus,
    default: PerformanceIndicatorStatus.ACTIVE,
  })
  public status: PerformanceIndicatorStatus;

  @ManyToOne(() => PerformanceMetricEntity, {
    nullable: false,
  })
  public metric: PerformanceMetricEntity;

  @ManyToOne(() => PerformanceDimensionEntity, {
    nullable: false,
  })
  public dimension: PerformanceDimensionEntity;

  @OneToMany(() => PerformanceTrackerEntity, PerformanceIndicatorEntity => PerformanceIndicatorEntity.performanceIndicator)
  public trackers: PerformanceTrackerEntity[];

  @Column({ type: 'enum', enum: PerformanceIndicatorSegment, default: PerformanceIndicatorSegment.MACHINE })
  public segment: PerformanceIndicatorSegment;

  @Column({ type: 'enum', enum: PerformanceIndicatorMode, default: PerformanceIndicatorMode.ALL })
  public mode: PerformanceIndicatorMode;

  @Column({ type: 'json' })
  public subSegment: PerformanceIndicatorSubsegment;

  @Column({
    type: 'smallint',
  })
  public targetValue: number;

  @Column({
    type: 'smallint', nullable: true,
  })
  public alertLowThreshold: number;

  @Column({
    type: 'smallint', nullable: true,
  })
  public alertHighThreshold: number;

  @Column({
    type: 'smallint', nullable: true,
  })
  public cutoffLowThreshold: number;

  @Column({
    type: 'smallint', nullable: true,
  })
  public cutoffHighThreshold: number;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

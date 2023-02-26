import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { PerformanceIndicatorEntity } from './performanceIndicator.entity';
import { ViolatedThreshold } from '../enums';
import { UserLogData } from '../interfaces';

@Entity('performance_tracker')
export class PerformanceTrackerEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({
    type: 'smallint', unsigned: true,
  })
  public indicatorId: number;

  @PrimaryColumn()
  public subsegmentItem: string;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @ManyToOne(() => PerformanceIndicatorEntity)
  @JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
  public performanceIndicator: PerformanceIndicatorEntity;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({
    type: 'smallint',
  })
  public value: number;

  @Column({ type: 'enum', enum: ViolatedThreshold, nullable: true })
  public violatedThreshold: ViolatedThreshold;
}

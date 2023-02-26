import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { PerformanceIndicatorDimension } from '../enums';
import { UserLogData } from '../interfaces';
import { PerformanceIndicatorEntity } from './performanceIndicator.entity';

@Entity('performance_dimension')
export class PerformanceDimensionEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({ type: 'smallint', unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'varchar', length: 100 })
  public name: string;

  @Column({ type: 'enum', enum: PerformanceIndicatorDimension })
  public dimensionType: PerformanceIndicatorDimension;

  @Column({
    type: 'smallint', unsigned: true,
  })
  public value: number;

  @OneToMany(() => PerformanceIndicatorEntity, PerformanceIndicatorEntity => PerformanceIndicatorEntity.dimension)
  public indicators: PerformanceIndicatorEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

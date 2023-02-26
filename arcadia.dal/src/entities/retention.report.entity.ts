import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { ActivityReportGroupingKeys } from '../enums';

@Entity('retention_report')
export class RetentionReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: ActivityReportGroupingKeys, nullable: true })
  public groupingKey: ActivityReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public r1: number;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public r2: number;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public r7: number;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public r14: number;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public r30: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}
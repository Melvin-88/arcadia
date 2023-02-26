import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisputesReportGroupingKeys } from '../enums';

@Entity('disputes_report')
export class DisputesReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: DisputesReportGroupingKeys, nullable: true })
  public groupingKey: DisputesReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({
    type: 'bigint', unsigned: true, nullable: true,
  })
  public totalDisputeCount: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

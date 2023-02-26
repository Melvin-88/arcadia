import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MachineStatusReportGroupingKeys } from '../enums';

@Entity('machine_status_report')
export class MachineStatusReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: MachineStatusReportGroupingKeys, nullable: true })
  public groupingKey: MachineStatusReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalMachines: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalAvailableTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalInPlayTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalErrorTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalOfflineTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalStoppedTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalShuttingDownTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalOnHoldTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalPreparingTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalReadyTime: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalSeedingTime: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

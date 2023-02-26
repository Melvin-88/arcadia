import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MachineStatus } from '../enums';

@Entity('machine_status_history')
export class MachineStatusHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true })
  public machineId: number;

  @Column({ type: 'enum', enum: MachineStatus })
  public status: MachineStatus;

  @CreateDateColumn({ type: 'datetime' })
  public timestamp: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('seed_history')
export class SeedHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'bigint', unsigned: true })
  public machineId: number;

  @Column({ type: 'json' })
  public seed: Record<string, number>;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;
}

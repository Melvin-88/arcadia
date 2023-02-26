import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RevenueReportGroupingKeys } from '../enums';

@Entity('revenue_report')
export class RevenueReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: RevenueReportGroupingKeys, nullable: true })
  public groupingKey: RevenueReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalNewPlayers: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalBets: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalWins: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalVoucherBets: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalVoucherWins: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalRefunds: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, nullable: true,
  })
  public totalGrossGaming: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, nullable: true,
  })
  public totalNetGaming: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

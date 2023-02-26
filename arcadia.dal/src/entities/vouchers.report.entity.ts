import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VouchersReportGroupingKeys } from '../enums';

@Entity('vouchers_report')
export class VouchersReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: VouchersReportGroupingKeys, nullable: true })
  public groupingKey: VouchersReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalVouchersIssued: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalVouchersUsed: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalVouchersBets: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalVouchersWins: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalVouchersExpired: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalVouchersCanceled: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalRoundsPlayed: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

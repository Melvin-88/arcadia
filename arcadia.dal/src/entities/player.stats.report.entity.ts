import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerStatsReportGroupingKeys } from '../enums';

@Entity('player_stats_report')
export class PlayerStatsReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: PlayerStatsReportGroupingKeys, nullable: true })
  public groupingKey: PlayerStatsReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalUniqueSessions: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalSessionTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalRoundsPlayed: number;

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
  public totalBehindBets: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalBehindWins: number;

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

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalWatchTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public maxWatchTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalQueueTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public maxQueueTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalInPlayTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public maxInPlayTime: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalAutoplayBets: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalAutoplayWins: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalSessionsWatch: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalSessionsQueue: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalSessionsBehind: number;

  @Column({
    type: 'decimal', precision: 16, scale: 2, unsigned: true, nullable: true,
  })
  public totalSessionsInPlay: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public totalAutoplaySessions: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

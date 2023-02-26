import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FunnelReportGroupingKeys } from '../enums';

@Entity('funnel_report')
export class FunnelReportEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'json' })
  public params: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  public paramsHash: string;

  @Column({ type: 'enum', enum: FunnelReportGroupingKeys, nullable: true })
  public groupingKey: FunnelReportGroupingKeys;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public groupingValue: string;

  @Column({ type: 'varchar', length: 16 })
  public date: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalUniqueSessions: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalRoundsPlayed: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalWatchTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public maxWatchTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalQueueTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public maxQueueTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalInPlayTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public maxInPlayTime: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionsWatch: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionsQueue: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionsBehind: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionsInPlay: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public totalSessionsChangeDenomination: number;

  @Column({ type: 'boolean' })
  public isCompleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

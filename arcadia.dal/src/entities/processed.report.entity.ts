import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportStatus, ReportTypes } from '../enums';

@Entity('processed_report')
export class ProcessedReportEntity {
  @PrimaryColumn('varchar', { length: 64 })
  public paramsHash: string;

  @Column({ type: 'enum', enum: ReportTypes })
  public reportType: ReportTypes;

  @Column({ type: 'json' })
  public params: Record<string, any>;

  @Column({ type: 'enum', enum: ReportStatus })
  public status: ReportStatus;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}

import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseReportQueryDto } from './base.report.query.dto';

export class PlayerStatsReportQueryDto extends BaseReportQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public operatorId: string[];

  @IsOptional()
  @IsString()
  public siteId: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public groupName: string[];

  @IsOptional()
  @IsString()
  public machineId: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public denomination: string[];

  @IsOptional()
  @IsString()
  public playerId: string;

  @IsOptional()
  @IsString()
  public sessionId: string;
}

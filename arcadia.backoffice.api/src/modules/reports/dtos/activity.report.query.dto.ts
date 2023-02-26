import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityReportGroupingKeys } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import { BaseReportQueryDto } from './base.report.query.dto';

export class ActivityReportQueryDto extends BaseReportQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public operatorId: string[];

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public siteId: string[];

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

  @IsEnum(ActivityReportGroupingKeys)
  public groupBy: ActivityReportGroupingKeys;
}

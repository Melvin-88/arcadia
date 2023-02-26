import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RetentionReportGroupingKeys } from 'arcadia-dal';
import { BaseReportQueryDto } from './base.report.query.dto';

export class RetentionReportQueryDto extends BaseReportQueryDto {
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

  @IsEnum(RetentionReportGroupingKeys)
  public groupBy: RetentionReportGroupingKeys;
}

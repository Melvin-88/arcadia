import { FunnelReportGroupingKeys } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseReportQueryDto } from './base.report.query.dto';

export class FunnelReportQueryDto extends BaseReportQueryDto {
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

  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'boolean' ? value : String(true) === value))
  public newPlayersOnly: boolean;

  @IsEnum(FunnelReportGroupingKeys)
  public groupBy: FunnelReportGroupingKeys;
}

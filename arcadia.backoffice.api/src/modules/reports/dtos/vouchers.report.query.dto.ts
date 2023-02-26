import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VouchersReportGroupingKeys } from 'arcadia-dal';
import { BaseReportQueryDto } from './base.report.query.dto';

export class VouchersReportQueryDto extends BaseReportQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public operatorId: string[];

  @IsOptional()
  @IsString()
  public voucherId: string;

  @IsOptional()
  @IsString()
  public playerCid: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public denomination: string[];

  @IsEnum(VouchersReportGroupingKeys)
  public groupBy: VouchersReportGroupingKeys;
}

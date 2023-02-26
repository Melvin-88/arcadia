import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { DisputesReportGroupingKeys, DisputesReportFilterBy, DisputeStatus } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import { BaseReportQueryDto } from './base.report.query.dto';

export class DisputesReportQueryDto extends BaseReportQueryDto {
  @IsEnum(DisputesReportFilterBy)
  public filterByDate: DisputesReportFilterBy;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public operatorId: string[];

  @IsOptional()
  @IsString()
  public playerCid: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public status: DisputeStatus[];

  @IsEnum(DisputesReportGroupingKeys)
  public groupBy: DisputesReportGroupingKeys;
}

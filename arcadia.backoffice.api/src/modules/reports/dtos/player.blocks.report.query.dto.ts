import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { PlayerBlocksReportGroupingKeys } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import { BaseReportQueryDto } from './base.report.query.dto';

export class PlayerBlocksReportQueryDto extends BaseReportQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public operatorId: string[];

  @IsOptional()
  @IsString()
  public playerId: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  @IsArray()
  public blockReason: string[];

  @IsEnum(PlayerBlocksReportGroupingKeys)
  public groupBy: PlayerBlocksReportGroupingKeys;
}

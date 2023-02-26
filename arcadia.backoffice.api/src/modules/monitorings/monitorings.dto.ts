import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PerformanceIndicatorMode,
  PerformanceIndicatorSegment,
  PerformanceIndicatorStatus,
  PerformanceIndicatorSubsegment,
} from 'arcadia-dal';

import { Type } from 'class-transformer';
import { PasswordRequiredDto } from '../../dtos/password.required.dto';

export class CreateMonitoringDto extends PasswordRequiredDto {
  @IsEnum(PerformanceIndicatorStatus)
  @IsNotEmpty()
  @ApiProperty()
  public status: PerformanceIndicatorStatus;

  @IsEnum(PerformanceIndicatorSegment)
  @IsNotEmpty()
  @ApiProperty()
  public segment: PerformanceIndicatorSegment;

  @ApiProperty({ type: PerformanceIndicatorSubsegment, required: false })
  @Type(() => PerformanceIndicatorSubsegment)
  @ValidateNested()
  @IsOptional()
  public segmentSubset: PerformanceIndicatorSubsegment;

  @IsEnum(PerformanceIndicatorMode)
  @IsNotEmpty()
  @ApiProperty()
  public mode: PerformanceIndicatorMode;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public metric: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public dimension: string;

  @IsNumber()
  @ApiProperty()
  public targetValue: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public alertLowThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public alertHighThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public cutoffLowThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public cutoffHighThreshold: number;
}

export class EditMonitoringDto extends PasswordRequiredDto {
  @IsEnum(PerformanceIndicatorStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  public status: PerformanceIndicatorStatus;

  @IsEnum(PerformanceIndicatorSegment)
  @IsOptional()
  @ApiProperty({ required: false })
  public segment: PerformanceIndicatorSegment;

  @ApiProperty({ type: PerformanceIndicatorSubsegment, required: false })
  @Type(() => PerformanceIndicatorSubsegment)
  @ValidateNested()
  @IsOptional()
  public segmentSubset: PerformanceIndicatorSubsegment;

  @IsEnum(PerformanceIndicatorMode)
  @IsOptional()
  @ApiProperty({ required: false })
  public mode: PerformanceIndicatorMode;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public metric: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public dimension: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public targetValue: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public alertLowThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public alertHighThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public cutoffLowThreshold: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public cutoffHighThreshold: number;
}

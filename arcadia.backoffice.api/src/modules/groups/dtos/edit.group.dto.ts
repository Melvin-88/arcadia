import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordRequiredDto } from '../../../dtos/password.required.dto';

export class EditGroupDto extends PasswordRequiredDto {
  @IsOptional()
  @Length(1, 128)
  @ApiProperty()
  public name?: string;

  @IsOptional()
  @Length(1, 128)
  @ApiProperty()
  public blueRibbonGameId?: string;

  @IsOptional()
  @Length(1, 64)
  @ApiProperty()
  public color?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  public denominator?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(255)
  @ApiProperty()
  public stackBuyLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(255)
  @ApiProperty()
  public stackCoinsSize?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  public isPrivate?: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  public idleTimeout?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  public graceTimeout?: number;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  public regulation?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  public configuration?: Record<string, any>;

  @IsOptional()
  @Length(1, 64)
  @ApiProperty()
  public prizeGroup: string;
}

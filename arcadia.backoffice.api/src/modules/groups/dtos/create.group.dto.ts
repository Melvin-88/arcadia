import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordRequiredDto } from '../../../dtos/password.required.dto';

export class CreateGroupDto extends PasswordRequiredDto {
  @Length(1, 128)
  @ApiProperty()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @Length(1, 128)
  public blueRibbonGameId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 64)
  @ApiProperty()
  public color?: string;

  @IsNumber()
  @ApiProperty()
  public denominator: number;

  @IsInt()
  @Min(1)
  @Max(255)
  @ApiProperty()
  public stackBuyLimit: number;

  @IsInt()
  @Min(1)
  @Max(255)
  @ApiProperty()
  public stackCoinsSize: number;

  @IsBoolean()
  @ApiProperty()
  public isPrivate: boolean;

  @IsInt()
  @ApiProperty()
  public idleTimeout: number;

  @IsInt()
  @ApiProperty()
  public graceTimeout: number;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  public regulation?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  public configuration?: Record<string, any>;

  @Length(1, 64)
  @ApiProperty()
  public prizeGroup: string;
}

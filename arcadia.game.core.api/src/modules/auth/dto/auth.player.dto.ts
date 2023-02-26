import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean, IsInt, IsNotEmpty, IsOptional, Length,
} from 'class-validator';

export class AuthPlayerDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  operatorId: number;

  @ApiProperty()
  @Length(1, 256)
  accessToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 128)
  gameCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(2, 64)
  language?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (typeof value === 'undefined') {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true' || value === 1;
  })
  @IsOptional()
  @IsBoolean()
  isReal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 64)
  partnerId?: string;

  @ApiProperty()
  @IsNotEmpty()
  playerIP: string;

  @ApiProperty()
  @Length(1, 32)
  clientVersion: string;

  @ApiProperty()
  @Length(1, 32)
  os: string;

  @ApiProperty()
  @Length(1, 16)
  deviceType: string;

  @ApiProperty()
  @Length(1, 32)
  browser: string;

  @ApiProperty()
  @IsOptional()
  @Length(10, 50)
  footprint?: string;
}

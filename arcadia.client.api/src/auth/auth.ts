import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length,
} from 'class-validator';

export class UserLogin {
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
}

export class UserLoginResponse {
  @ApiResponseProperty()
  url: string;

  @ApiResponseProperty()
  token: string;
}

export class StreamAuth {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
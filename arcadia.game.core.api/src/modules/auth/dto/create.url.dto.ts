import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean, IsIP, IsJWT, IsOptional, IsUrl, Length,
} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty()
  @Length(1, 128)
  operator: string;

  @ApiProperty()
  @Length(1, 128)
  gameToken: string;

  @ApiProperty()
  @IsIP()
  callerIp: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsJWT()
  authToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 128)
  partnerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 128)
  gameCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isReal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(2, 50)
  languageCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  homeUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  cashierUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 100)
  jurisdiction?: string;
}
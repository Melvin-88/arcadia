import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean, IsNumber, IsOptional, Length,
} from 'class-validator';
import { CustomParamDto } from './customParamDto';

export class BetRequestDto extends CustomParamDto {
  @ApiProperty()
  @Length(1, 200)
  cid: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  amount: number;

  @ApiProperty()
  @Length(1, 200)
  sessionToken: string;

  @ApiProperty()
  @Length(1, 200)
  roundId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 200)
  transactionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRoundFinish?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AmountInCurrency } from './amount.in.currency.dto';

export class WinnerDetails {
  @ApiProperty()
  @IsString()
  public gameId: string;

  @ApiProperty()
  @IsBoolean()
  public hasExtraPayments: boolean;

  @ApiProperty()
  @IsString()
  public eventId: string;

  @ApiProperty()
  @IsString()
  public jackpotType: string;

  @ApiProperty()
  @IsString()
  public operatorId: string;

  @ApiProperty()
  @IsString()
  public playerCurrency: string;

  @ApiProperty()
  @IsString()
  public jackpotGameId: string;

  @ApiProperty()
  @IsString()
  public playerId: string;

  @ApiProperty()
  @IsString()
  public potId: string;

  @ApiProperty()
  @IsString()
  public seed: string;

  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty({ type: [AmountInCurrency] })
  @IsArray()
  @Type(() => AmountInCurrency)
  @ValidateNested({ each: true })
  public amountInCurrency: AmountInCurrency[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  public segments: string[];

  @ApiProperty()
  @IsDateString()
  public winTimestamp: string;

  @ApiProperty()
  @IsObject()
  public extraFields: Record<string, any>;
}

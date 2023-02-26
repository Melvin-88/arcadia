import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumberString,
  IsObject,
  IsString,
} from 'class-validator';

class AmountInCurrency {
  @ApiProperty()
  @IsNumberString()
  public amount: string;

  @ApiProperty()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsNumberString()
  public rate: string;
}

class WinnerDetails {
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

  @ApiProperty()
  @IsString()
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

export class JackpotWinDto {
  @ApiProperty()
  @IsObject()
  public winnerDetails: WinnerDetails;
}

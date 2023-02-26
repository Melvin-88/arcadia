import { BetBehindConfiguration } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber } from 'class-validator';

export class BetBehindConfigDto extends BetBehindConfiguration {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  stopAfterRounds: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  singleWinThreshold: number;

  @IsBoolean()
  stopIfJackpot: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lowLimitMultiplier: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  hiLimitMultiplier: number;
}

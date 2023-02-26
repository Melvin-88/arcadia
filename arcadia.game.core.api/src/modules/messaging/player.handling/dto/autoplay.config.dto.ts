import { AutoplayConfiguration, TiltMode } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
} from 'class-validator';

export class AutoplayConfigDto extends AutoplayConfiguration {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  stopAfterRounds: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  singleWinThreshold: number;

  @IsBoolean()
  stopIfJackpot: boolean;

  @IsEnum(TiltMode)
  tiltMode: TiltMode;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lowLimitMultiplier: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  hiLimitMultiplier: number;
}

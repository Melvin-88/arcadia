import { IsArray, IsNumber } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class BetDto extends SessionAwareDto {
  denominator?: number;

  cashValue?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  groups?: number[];
}
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class SetAngleMessageDto extends SessionAwareDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  public angle: number;
}

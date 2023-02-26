import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Length } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class RobotToCoreBaseMessage extends SessionAwareDto {
  @Length(1, 100)
  public type: string;

  @Length(1, 256)
  public serial: string;

  @Transform(({ value }) => {
    const result = parseInt(value, 10);
    if (Number.isNaN(result)) {
      return undefined;
    }
    return result;
  })
  @IsOptional()
  @IsInt()
  key?: number
}

import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class BuyMessageDto extends SessionAwareDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  stacks: number;

  @Transform(({ value }) => {
    const result = parseInt(value, 10);
    if (Number.isNaN(result)) {
      return undefined;
    }
    return result;
  })
  @IsOptional()
  @IsInt()
  voucherId?: number;
}

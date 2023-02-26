import { SessionEntity } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import { Allow, IsInt, IsOptional } from 'class-validator';
import { CorrelationAwareDto } from './correlation.aware.dto';

export class SessionAwareDto extends CorrelationAwareDto {
  @Transform(({ value }) => {
    const result = parseInt(value, 10);
    if (Number.isNaN(result)) {
      return undefined;
    }
    return result;
  })
  @IsOptional()
  @IsInt()
  sessionId?: number;

  @Allow()
  session?: SessionEntity;
}

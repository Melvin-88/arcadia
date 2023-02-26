import { SessionEntity } from 'arcadia-dal';
import { Transform } from 'class-transformer';
import {
  Allow, IsInt, IsOptional, Length,
} from 'class-validator';

export class SessionAwareDto {
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

  @IsOptional()
  @Length(10, 50)
  correlationId?: string;

  @Allow()
  session?: SessionEntity;
}

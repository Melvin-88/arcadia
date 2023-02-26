import { IsOptional, Length } from 'class-validator';

export class CorrelationAwareDto {
  @IsOptional()
  @Length(10, 50)
  correlationId?: string;
}

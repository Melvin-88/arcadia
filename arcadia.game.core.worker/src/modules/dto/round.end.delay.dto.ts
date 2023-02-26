import { IsNumber } from 'class-validator';
import { SessionAwareDto } from './session.aware.dto';

export class RoundEndDelayDto extends SessionAwareDto {
  @IsNumber()
  timeout: number;
}

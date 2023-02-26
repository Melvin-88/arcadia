import { IsBoolean, IsOptional } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class PlayerJoinedMessageDto extends SessionAwareDto {
  @IsOptional()
  @IsBoolean()
  public reconnect?: boolean;
}

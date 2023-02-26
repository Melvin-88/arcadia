import { IsIn } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class MoveMessageDto extends SessionAwareDto {
  @IsIn(['left', 'right'])
  public direction: 'left' | 'right';
}

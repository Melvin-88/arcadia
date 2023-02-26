import { IsEnum } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';
import { QuitReason } from '../enum/quit.reason';

export class QuitDto extends SessionAwareDto {
  @IsEnum(QuitReason)
  reason: QuitReason;
}

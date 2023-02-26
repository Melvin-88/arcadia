import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { BetBehindConfigDto } from './bet.behind.config.dto';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class BbEnableMessageDto extends SessionAwareDto {
  @ValidateNested()
  @Type(() => BetBehindConfigDto)
  @IsDefined()
  public betBehind: BetBehindConfigDto;
}

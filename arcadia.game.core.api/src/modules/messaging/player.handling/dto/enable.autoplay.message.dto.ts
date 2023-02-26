import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { AutoplayConfigDto } from './autoplay.config.dto';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class EnableAutoplayMessageDto extends SessionAwareDto {
  @ValidateNested()
  @Type(() => AutoplayConfigDto)
  @IsDefined()
  public autoplay: AutoplayConfigDto;
}

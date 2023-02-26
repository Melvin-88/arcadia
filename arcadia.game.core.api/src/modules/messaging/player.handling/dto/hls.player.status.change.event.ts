import { IsEnum, IsNotEmpty } from 'class-validator';
import { HlsPlayerStatusEnum } from '../enum/hls.player.status.enum';
import { PlayerTypeEnum } from '../enum/player.type.enum';
import { PlayerStatusChangeEvent } from './player.status.change.event';

export class HlsPlayerStatusChangeEvent extends PlayerStatusChangeEvent {
  public type: PlayerTypeEnum.HLSPlayer;

  @IsEnum(HlsPlayerStatusEnum)
  @IsNotEmpty()
  public status: HlsPlayerStatusEnum;
}

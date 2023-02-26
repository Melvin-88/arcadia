import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlayerTypeEnum } from '../enum/player.type.enum';
import { CsrtcPlayerStatusEnum } from '../enum/csrtc.player.status.enum';
import { PlayerStatusChangeEvent } from './player.status.change.event';

export class CsrtcPlayerStatusChangeEvent extends PlayerStatusChangeEvent {
    @IsString()
    @IsNotEmpty()
    public type: PlayerTypeEnum.CSRTCPlayer;

    @IsEnum(CsrtcPlayerStatusEnum)
    @IsNotEmpty()
    public status: CsrtcPlayerStatusEnum;
}

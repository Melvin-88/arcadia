import { IsEnum, IsNotEmpty } from 'class-validator';
import { PlayerTypeEnum } from '../enum/player.type.enum';

export abstract class PlayerStatusChangeEvent {
    @IsNotEmpty()
    @IsEnum(PlayerTypeEnum)
    public type: PlayerTypeEnum;

    public status: string;
}

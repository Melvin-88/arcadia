import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionAwareDto } from '../../../dto/session.aware.dto';
import { PlayerStatusChangeEvent } from './player.status.change.event';
import { HlsPlayerStatusChangeEvent } from './hls.player.status.change.event';
import { PlayerTypeEnum } from '../enum/player.type.enum';
import { CsrtcPlayerStatusChangeEvent } from './csrtc.player.status.change.event';

export class VideoMessageDto extends SessionAwareDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PlayerStatusChangeEvent, {
      keepDiscriminatorProperty: true,
      discriminator: {
        property: 'type',
        subTypes: [
          { value: HlsPlayerStatusChangeEvent, name: PlayerTypeEnum.HLSPlayer },
          { value: CsrtcPlayerStatusChangeEvent, name: PlayerTypeEnum.CSRTCPlayer },
        ],
      },
    })
    event: CsrtcPlayerStatusChangeEvent | HlsPlayerStatusChangeEvent;
}

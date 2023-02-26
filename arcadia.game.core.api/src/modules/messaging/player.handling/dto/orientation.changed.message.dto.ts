import { IsIn } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class OrientationChangedMessageDto extends SessionAwareDto {
    @IsIn(['portrait', 'landscape'])
    public orientation: 'portrait' | 'landscape';
}

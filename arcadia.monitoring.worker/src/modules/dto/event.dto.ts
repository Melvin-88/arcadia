import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventSource } from '../enum';
import { EventParams } from './eventParams.dto';
import { EventType } from '../coreClient/enum';

export class EventDto {
    @IsString()
    @IsNotEmpty()
    public source: EventSource;

    @IsString()
    @IsNotEmpty()
    public eventType: EventType;

    @ValidateNested()
    @Type(() => EventParams)
    public params: EventParams;
}

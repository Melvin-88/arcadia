import { EventSource } from '../enum/event.source';
import { EventType } from '../enum/event.type';
import { EventParams } from './event.params';

export interface EventLogData {
    source?: EventSource;
    eventType?: EventType;
    params: EventParams;
}

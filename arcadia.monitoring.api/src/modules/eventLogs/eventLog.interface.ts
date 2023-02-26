import { ApiProperty } from '@nestjs/swagger';

export class EventLogResponse {
    @ApiProperty()
    public source: string;

    @ApiProperty()
    public type: string;

    @ApiProperty()
    public parameters: Record<string, any>;

    @ApiProperty()
    public createdDate: Date;
}

export class EventLogsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [EventLogResponse] })
    public logs: EventLogResponse[];
}

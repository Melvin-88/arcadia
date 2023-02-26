import { ApiProperty } from '@nestjs/swagger';

export class MonitoringResponse {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public status: string;

    @ApiProperty()
    public segment: string;

    @ApiProperty()
    public segmentSubset: Record<string, any>;

    @ApiProperty()
    public mode: string;

    @ApiProperty()
    public metric: string;

    @ApiProperty()
    public dimension: string;

    @ApiProperty()
    public targetValue: number;

    @ApiProperty()
    public currentValue: { value: number; subsegmentItem: string; }[];

    @ApiProperty()
    public alertLowThreshold: number;

    @ApiProperty()
    public alertHighThreshold: number;

    @ApiProperty()
    public cutoffLowThreshold: number;

    @ApiProperty()
    public cutoffHighThreshold: number;
}

export class MonitoringsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [MonitoringResponse] })
    public monitoring: MonitoringResponse[];
}

export class MetricsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty()
    public metric: string[];
}

export class DimensionResponse {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public id: number;
}

export class DimensionsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty()
    public dimension: DimensionResponse[];
}

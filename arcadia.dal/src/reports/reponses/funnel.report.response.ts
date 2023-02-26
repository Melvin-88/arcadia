import { ApiProperty } from '@nestjs/swagger';
import { FunnelReportInterface } from '../interfaces';
import { FunnelReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class FunnelReportResponse extends AbstractReportResponse {
    @ApiProperty({ type: [FunnelReportInterface] })
    public data: FunnelReportInterface[];

    @ApiProperty({ enum: FunnelReportGroupingKeys })
    public groupingKey: FunnelReportGroupingKeys;
}

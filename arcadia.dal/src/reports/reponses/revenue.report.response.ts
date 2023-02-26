import { ApiProperty } from '@nestjs/swagger';
import { RevenueReportInterface } from '../interfaces';
import { RevenueReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class RevenueReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [RevenueReportInterface] })
  public data: RevenueReportInterface[];

  @ApiProperty({ enum: RevenueReportGroupingKeys })
  public groupingKey: RevenueReportGroupingKeys;
}

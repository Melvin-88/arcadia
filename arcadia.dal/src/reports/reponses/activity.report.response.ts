import { ApiProperty } from '@nestjs/swagger';
import { ActivityReportInterface } from '../interfaces';
import { ActivityReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class ActivityReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [ActivityReportInterface] })
  public data: ActivityReportInterface[];

  @ApiProperty({ enum: ActivityReportGroupingKeys })
  public groupingKey: ActivityReportGroupingKeys;
}

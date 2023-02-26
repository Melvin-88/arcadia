import { ApiProperty } from '@nestjs/swagger';
import { RetentionReportInterface } from '../interfaces';
import { RetentionReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class RetentionReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [RetentionReportInterface] })
  public data: RetentionReportInterface[];

  @ApiProperty({ enum: RetentionReportGroupingKeys })
  public groupingKey: RetentionReportGroupingKeys;
}

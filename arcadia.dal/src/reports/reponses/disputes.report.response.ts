import { ApiProperty } from '@nestjs/swagger';
import { DisputesReportInterface } from '../interfaces';
import { DisputesReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class DisputesReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [DisputesReportInterface] })
  public data: DisputesReportInterface[];

  @ApiProperty({ enum: DisputesReportGroupingKeys })
  public groupingKey: DisputesReportGroupingKeys;
}

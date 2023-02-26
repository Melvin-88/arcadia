import { ApiProperty } from '@nestjs/swagger';
import { VouchersReportInterface } from '../interfaces';
import { VouchersReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class VouchersReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [VouchersReportInterface] })
  public data: VouchersReportInterface[];

  @ApiProperty({ enum: VouchersReportGroupingKeys })
  public groupingKey: VouchersReportGroupingKeys;
}

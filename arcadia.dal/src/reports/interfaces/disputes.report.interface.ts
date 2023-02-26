/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';

export class DisputesReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_dispute_count: number;
}

export class DisputesReportsInterface {
  @ApiProperty({ type: [DisputesReportInterface] })
  data: DisputesReportInterface[];

  @ApiProperty()
  total: number;
}

/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class RetentionReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  r1: number;

  @ApiProperty()
  r2: number;

  @ApiProperty()
  r7: number;

  @ApiProperty()
  r14: number;

  @ApiProperty()
  r30: number;
}

export class RetentionReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: RetentionReportInterface })
  data: RetentionReportInterface[];
}

/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class PlayerBlocksReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_blocked: number;

  @ApiProperty()
  total_unblocked: number;
}

export class PlayerBlocksReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: PlayerBlocksReportInterface })
  data: PlayerBlocksReportInterface[];
}

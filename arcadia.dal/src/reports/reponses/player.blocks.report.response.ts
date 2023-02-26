import { ApiProperty } from '@nestjs/swagger';
import { PlayerBlocksReportInterface } from '../interfaces';
import { PlayerBlocksReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class PlayerBlocksReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [PlayerBlocksReportInterface] })
  public data: PlayerBlocksReportInterface[];

  @ApiProperty({ enum: PlayerBlocksReportGroupingKeys })
  public groupingKey: PlayerBlocksReportGroupingKeys;
}

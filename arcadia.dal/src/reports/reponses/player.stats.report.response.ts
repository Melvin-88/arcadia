import { ApiProperty } from '@nestjs/swagger';
import { PlayerStatsReportInterface } from '../interfaces';
import { PlayerStatsReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class PlayerStatsReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [PlayerStatsReportInterface] })
  public data: PlayerStatsReportInterface[];

  @ApiProperty({ enum: PlayerStatsReportGroupingKeys })
  public groupingKey: PlayerStatsReportGroupingKeys;
}

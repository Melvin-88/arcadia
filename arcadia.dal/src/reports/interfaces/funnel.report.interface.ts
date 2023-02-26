/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class FunnelReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_unique_players: number;

  @ApiProperty()
  total_unique_sessions: number;

  @ApiProperty()
  total_session_time: number;

  @ApiProperty()
  avg_session_time: number;

  @ApiProperty()
  total_rounds_played: number;

  @ApiProperty()
  avg_rounds_per_session: number;

  @ApiProperty()
  total_watch_time: number;

  @ApiProperty()
  avg_watch_time: number;

  @ApiProperty()
  max_watch_time: number;

  @ApiProperty()
  total_queue_time: number;

  @ApiProperty()
  avg_queue_time: number;

  @ApiProperty()
  max_queue_time: number;

  @ApiProperty()
  total_in_play_time: number;

  @ApiProperty()
  avg_in_play_time: number;

  @ApiProperty()
  max_in_play_time: number;

  @ApiProperty()
  total_sessions_watch: number;

  @ApiProperty()
  percent_sessions_watch: number;

  @ApiProperty()
  total_sessions_queue: number;

  @ApiProperty()
  percent_sessions_queue: number;

  @ApiProperty()
  total_sessions_behind: number;

  @ApiProperty()
  percent_sessions_behind: number;

  @ApiProperty()
  total_sessions_in_play: number;

  @ApiProperty()
  percent_sessions_in_play: number;

  @ApiProperty()
  total_sessions_change_denomination: number;

  @ApiProperty()
  percent_sessions_change_denomination: number;
}

export class FunnelReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: FunnelReportInterface })
  data: FunnelReportInterface[];
}

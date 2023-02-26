/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class PlayerStatsReportInterface {
  @ApiProperty()
  grouping_value: string;

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
  total_bets: number;

  @ApiProperty()
  total_wins: number;

  @ApiProperty()
  total_behind_bets: number;

  @ApiProperty()
  total_behind_wins: number;

  @ApiProperty()
  total_voucher_bets: number;

  @ApiProperty()
  total_voucher_wins: number;

  @ApiProperty()
  total_refunds: number;

  @ApiProperty()
  total_gross_gaming: number;

  @ApiProperty()
  total_net_gaming: number;

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
  total_autoplay_bets: number;

  @ApiProperty()
  total_autoplay_wins: number;

  @ApiProperty()
  percent_autoplay_sessions: number;

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
  ltv: number;
}

export class PlayerStatsReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: PlayerStatsReportInterface })
  data: PlayerStatsReportInterface[];
}

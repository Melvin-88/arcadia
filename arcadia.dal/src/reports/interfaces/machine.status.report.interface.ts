/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';

export class MachineStatusReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_machines: number;

  @ApiProperty()
  total_available_time: number;

  @ApiProperty()
  percent_available_time: number;

  @ApiProperty()
  total_in_play_time: number;

  @ApiProperty()
  percent_in_play_time: number;

  @ApiProperty()
  total_error_time: number;

  @ApiProperty()
  percent_error_time: number;

  @ApiProperty()
  total_offline_time: number;

  @ApiProperty()
  percent_offline_time: number;

  @ApiProperty()
  total_stopped_time: number;

  @ApiProperty()
  percent_stopped_time: number;

  @ApiProperty()
  total_shutting_down_time: number;

  @ApiProperty()
  percent_shutting_down_time: number;

  @ApiProperty()
  total_preparing_time: number;

  @ApiProperty()
  percent_preparing_time: number;

  @ApiProperty()
  total_ready_time: number;

  @ApiProperty()
  percent_ready_time: number;

  @ApiProperty()
  total_seeding_time: number;

  @ApiProperty()
  percent_seeding_time: number;

  @ApiProperty()
  total_on_hold_time: number;

  @ApiProperty()
  percent_on_hold_time: number;
}

export class MachineStatusReportsInterface {
  @ApiProperty({ type: MachineStatusReportInterface })
  data: MachineStatusReportInterface[];

  @ApiProperty()
  total: number;
}

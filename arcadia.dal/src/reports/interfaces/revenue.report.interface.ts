/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class RevenueReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_unique_players: number;

  @ApiProperty()
  total_new_players: number;

  @ApiProperty()
  total_bets: number;

  @ApiProperty()
  total_wins: number;

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
  arpu: number;
}

export class RevenueReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: RevenueReportInterface })
  data: RevenueReportInterface[];
}

/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface } from './abstract.report.interface';

export class VouchersReportInterface {
  @ApiProperty()
  grouping_value: string;

  @ApiProperty()
  total_vouchers_issued: number;

  @ApiProperty()
  total_vouchers_used: number;

  @ApiProperty()
  total_vouchers_bets: number;

  @ApiProperty()
  total_vouchers_wins: number;

  @ApiProperty()
  total_vouchers_expired: number;

  @ApiProperty()
  total_vouchers_canceled: number;

  @ApiProperty()
  total_rounds_played: number;
}

export class VoucherReportsInterface extends AbstractReportInterface {
  @ApiProperty({ type: [VouchersReportInterface] })
  data: VouchersReportInterface[];
}

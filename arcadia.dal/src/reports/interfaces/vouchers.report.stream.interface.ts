/* eslint-disable camelcase */
import { VoucherStatus } from '../../enums';

export class VouchersReportStreamInterface {
  id: number;
  status: VoucherStatus;
  create_date: string;
  update_date: string;
  day?: string;
  month?: string;
  expiration_date: string;
  operator: string;
  denomination: string;
  round_id: string;
  player: string;
  round_win: string;
  end_date: string;
}

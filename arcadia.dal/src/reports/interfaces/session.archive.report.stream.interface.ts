/* eslint-disable camelcase */
import { RoundStatus, RoundType } from '../../enums';

export class SessionArchiveReportStreamInterface {
  id: number;
  duration: number;
  round_id: number;
  machine: number;
  site: number;
  group: number;
  operator: number;
  player_cid: string;
  viewer_duration: number;
  queue_duration: number;
  round_bet: number;
  round_wins: number;
  round_status: RoundStatus;
  round_is_autoplay: boolean;
  round_type: RoundType;
  day: string;
  month: string;
  start_date: Date;
  player_create_date: Date;
  denomination: number;
  is_denomination_changed: boolean;
}

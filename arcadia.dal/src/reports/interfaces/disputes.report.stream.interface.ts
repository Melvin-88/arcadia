import { DisputeStatus } from '../../enums';

export class DisputesReportStreamInterface {
  id: number;
  day: string;
  month: string;
  operator: string;
  player: string;
  // reason: string;
  status: DisputeStatus;
}

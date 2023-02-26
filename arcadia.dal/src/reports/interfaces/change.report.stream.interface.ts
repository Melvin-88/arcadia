/* eslint-disable camelcase */

export class ChangeReportStreamInterface {
  date: string;
  old_entity: any;
  new_entity: any;
  player?: string;
  reason?: string;
  day?: string;
  month?: string;
  operator?: string;
}

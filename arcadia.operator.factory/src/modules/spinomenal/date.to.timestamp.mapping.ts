import * as moment from 'moment';

const timestampFormat = 'YYYYMMDDHHmmss';

export function parseTimestamp(timestamp: string): Date {
  return moment(timestamp, timestampFormat, true).toDate();
}

export function createTimestamp(date: Date): string {
  return moment(date).format(timestampFormat);
}

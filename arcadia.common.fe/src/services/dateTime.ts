import moment from 'moment';
import 'moment-duration-format';
import { TimeSpanFormat } from '../types';
import { DATE_FORMAT_LONG } from '../constants';

export type unitOfTime = (
  'year' | 'years' | 'y' |
  'month' | 'months' | 'M' |
  'week' | 'weeks' | 'w' |
  'day' | 'days' | 'd' |
  'hour' | 'hours' | 'h' |
  'minute' | 'minutes' | 'm' |
  'second' | 'seconds' | 's' |
  'millisecond' | 'milliseconds' | 'ms'
);

export const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

export const formatSecondsToMinutesSeconds = (seconds: number) => {
  const minutes = secondsToMinutes(seconds);
  const remainSeconds = Math.floor(seconds % 60);

  let result = minutes < 10 ? `0${minutes}` : minutes;

  result += `:${remainSeconds < 10 ? `0${remainSeconds}` : remainSeconds}`;

  return result;
};

export const getDateTimeFormatted = (date: null | string | number | Date, dateFormat = DATE_FORMAT_LONG) => {
  if (!date) {
    return date;
  }

  return moment(new Date(date)).format(dateFormat);
};

export const getDateDiffInDays = (date1: Date | string | null, date2: Date | string | null, unitOfTime: unitOfTime = 'days') => {
  if (!date1 || !date2) {
    return 0;
  }

  const admission = moment(new Date(date1));
  const discharge = moment(new Date(date2));

  return discharge.diff(admission, unitOfTime);
};

export const dateSubtractDays = (date: Date | string, days: string): Date => moment(new Date(date)).subtract(days, 'days').toDate();

export const dateAddDays = (date: Date | string, days: string): Date => moment(new Date(date)).add(days, 'days').toDate();

export const secondsToTimeSpan = (seconds: number, formatString: string = TimeSpanFormat.HHmmss) => (
  moment.utc(seconds * 1000).format(formatString)
);

export const convertDateTimeToSeconds = (value: number) => new Date(value).getTime();

export const convertTimeToSeconds = (value: string, timeSpanFormat: TimeSpanFormat) => {
  if (!value) {
    return 0;
  }

  let hoursPart = '0';
  let minutesPart = '0';
  let secondsPart = '0';

  const chunks = String(value).split(':');

  switch (timeSpanFormat) {
    case TimeSpanFormat.HHmmss:
      [hoursPart, minutesPart, secondsPart] = chunks;
      break;
    case TimeSpanFormat.HHmm:
      [hoursPart, minutesPart] = chunks;
      break;
    case TimeSpanFormat.mmss:
      [minutesPart, secondsPart] = chunks;
      break;
    case TimeSpanFormat.mm:
      [minutesPart] = chunks;
      break;
    default:
      break;
  }

  const hours = Number.parseInt(hoursPart, 10) || 0;
  const minutes = Number.parseInt(minutesPart, 10) || 0;
  const seconds = Number.parseInt(secondsPart, 10) || 0;

  return (hours * 60 * 60) + (minutes * 60) + seconds;
};

export const dateSetEndOfTheDate = (value: Date) => {
  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );
};

export const dateSetZeroTimeOfTheDate = (value: Date) => {
  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  );
};


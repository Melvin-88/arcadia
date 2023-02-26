import * as moment from 'moment';

export function getDaysBetweenDates(startDate: string, endDate: string): string[] {
  const currentMoment = moment(startDate);
  const endMoment = moment(endDate);
  const days: string[] = [];

  while (currentMoment.isSameOrBefore(endMoment)) {
    days.push(currentMoment.format('YYYY-MM-DD'));
    currentMoment.add(1, 'days');
  }

  return days;
}

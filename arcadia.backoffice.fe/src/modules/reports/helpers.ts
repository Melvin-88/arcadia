import moment from 'moment';
import { DATE_FORMAT_LONG } from 'arcadia-common-fe';
import { IReportsFiltersPanelValues } from './types';

export const preprocessReportFiltersPanelValues = (data: IReportsFiltersPanelValues) => ({
  ...data,
  startDate: moment(data.startDate).format(DATE_FORMAT_LONG).split(' ')[0],
  endDate: moment(data.endDate).format(DATE_FORMAT_LONG).split(' ')[0],
});

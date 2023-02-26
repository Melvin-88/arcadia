import { ReportStatus } from './types';

export const reportStatusLabelMap: { [key in ReportStatus]: string } = {
  [ReportStatus.pending]: 'Pending',
  [ReportStatus.inProgress]: 'In progress',
  [ReportStatus.ready]: 'Ready',
  [ReportStatus.error]: 'Error',
};

import React from 'react';
import { StatusIndicatorColor, StatusIndicator } from 'arcadia-common-fe';
import { reportStatusLabelMap } from '../../../constants';
import { ReportStatus } from '../../../types';

export const reportStatusColorMap: { [key in ReportStatus]: StatusIndicatorColor } = {
  [ReportStatus.pending]: StatusIndicatorColor.green,
  [ReportStatus.inProgress]: StatusIndicatorColor.yellow,
  [ReportStatus.ready]: StatusIndicatorColor.green,
  [ReportStatus.error]: StatusIndicatorColor.red,
};

interface IProcessedReportStatusProps {
  className?: string
  status: ReportStatus
}

export const ProcessedReportStatus: React.FC<IProcessedReportStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={reportStatusColorMap[status]}
  >
    { reportStatusLabelMap[status] }
  </StatusIndicator>
));

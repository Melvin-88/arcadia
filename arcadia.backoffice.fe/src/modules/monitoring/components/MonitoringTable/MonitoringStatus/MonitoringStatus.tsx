import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { MonitoringStatus as Status } from '../../../types';
import { monitoringStatusLabelMap } from '../../../constants';

export const monitoringStatusColorMap: { [key in Status]: StatusIndicatorColor } = {
  [Status.suspended]: StatusIndicatorColor.red,
  [Status.active]: StatusIndicatorColor.green,
};

interface IMonitoringStatusProps {
  className?: string
  status: Status
}

export const MonitoringStatus: React.FC<IMonitoringStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={monitoringStatusColorMap[status]}
  >
    { monitoringStatusLabelMap[status] }
  </StatusIndicator>
));

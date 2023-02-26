import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { alertStatusLabelMap } from '../../../constants';
import { AlertStatus } from '../../../types';

export const alertStatusColorMap: { [key in AlertStatus]: StatusIndicatorColor } = {
  [AlertStatus.active]: StatusIndicatorColor.green,
  [AlertStatus.dismissed]: StatusIndicatorColor.red,
};

interface IAlertsStatusProps {
  className?: string
  status: AlertStatus
}

export const AlertsStatus: React.FC<IAlertsStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={alertStatusColorMap[status]}
  >
    { alertStatusLabelMap[status] }
  </StatusIndicator>
));

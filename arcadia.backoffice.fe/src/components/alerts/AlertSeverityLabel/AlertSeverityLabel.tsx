import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { AlertSeverity } from '../../../types/alerts';
import { alertSeverityLabelMap } from '../../../constants/alerts';

export const alertSeverityColorMap: { [key in AlertSeverity]: StatusIndicatorColor } = {
  [AlertSeverity.high]: StatusIndicatorColor.red,
  [AlertSeverity.medium]: StatusIndicatorColor.orange,
  [AlertSeverity.low]: StatusIndicatorColor.yellow,
};

interface IAlertSeverityLabelProps {
  className?: string
  severity: AlertSeverity
}

export const AlertSeverityLabel: React.FC<IAlertSeverityLabelProps> = React.memo(({
  className,
  severity,
}) => (
  <StatusIndicator
    className={className}
    color={alertSeverityColorMap[severity]}
  >
    { alertSeverityLabelMap[severity] }
  </StatusIndicator>
));

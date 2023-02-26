import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { AlertType } from '../../../types/alerts';
import { alertTypeLabelMap } from '../../../constants/alerts';

export const alertTypeColorMap: { [key in AlertType]: StatusIndicatorColor } = {
  [AlertType.information]: StatusIndicatorColor.blue,
  [AlertType.warning]: StatusIndicatorColor.yellow,
  [AlertType.alert]: StatusIndicatorColor.orange,
  [AlertType.critical]: StatusIndicatorColor.red,
};

interface IAlertTypeLabelProps {
  className?: string
  type: AlertType
}

export const AlertTypeLabel: React.FC<IAlertTypeLabelProps> = React.memo(({
  className,
  type,
}) => (
  <StatusIndicator
    className={className}
    color={alertTypeColorMap[type]}
  >
    { alertTypeLabelMap[type] }
  </StatusIndicator>
));

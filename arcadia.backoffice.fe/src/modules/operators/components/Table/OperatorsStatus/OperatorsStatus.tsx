import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { OperatorStatus } from '../../../types';
import { operatorStatusLabelMap } from '../../../constants';

export const operatorStatusColorMap: { [key in OperatorStatus]: StatusIndicatorColor } = {
  [OperatorStatus.disabled]: StatusIndicatorColor.red,
  [OperatorStatus.enabled]: StatusIndicatorColor.green,
};

interface IOperatorsStatusProps {
  className?: string
  status: OperatorStatus
}

export const OperatorsStatus: React.FC<IOperatorsStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={operatorStatusColorMap[status]}
  >
    { operatorStatusLabelMap[status] }
  </StatusIndicator>
));

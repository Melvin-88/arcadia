import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { queueStatusLabelMap } from '../../../constants';
import { QueueStatus } from '../../../types';

export const queueStatusColorMap: { [key in QueueStatus]: StatusIndicatorColor } = {
  [QueueStatus.inPlay]: StatusIndicatorColor.green,
  [QueueStatus.ready]: StatusIndicatorColor.blue,
  [QueueStatus.drying]: StatusIndicatorColor.yellow,
  [QueueStatus.stopped]: StatusIndicatorColor.red,
};

interface IQueuesStatusProps {
  className?: string
  status: QueueStatus
}

export const QueuesStatus: React.FC<IQueuesStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={queueStatusColorMap[status]}
  >
    { queueStatusLabelMap[status] }
  </StatusIndicator>
));

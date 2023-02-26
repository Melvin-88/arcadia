import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { disputeStatusLabelMap } from '../../../constants';
import { DisputeStatus } from '../../../types';

export const disputeStatusColorMap: { [key in DisputeStatus]: StatusIndicatorColor } = {
  [DisputeStatus.open]: StatusIndicatorColor.green,
  [DisputeStatus.inquiring]: StatusIndicatorColor.orange,
  [DisputeStatus.closed]: StatusIndicatorColor.grey,
};

interface IDisputesStatusProps {
  className?: string
  status: DisputeStatus
}

export const DisputesStatus: React.FC<IDisputesStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={disputeStatusColorMap[status]}
  >
    { disputeStatusLabelMap[status] }
  </StatusIndicator>
));

import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';

interface IRecordStatusProps {
  className?: string
  status: boolean
}

export const RecordStatus: React.FC<IRecordStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={status ? StatusIndicatorColor.green : StatusIndicatorColor.red}
  >
    { status ? 'Online' : 'Offline' }
  </StatusIndicator>
));

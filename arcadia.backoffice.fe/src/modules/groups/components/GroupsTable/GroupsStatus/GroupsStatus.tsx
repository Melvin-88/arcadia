import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { groupStatusLabelMap } from '../../../constants';
import { GroupStatus } from '../../../types';

export const groupStatusColorMap: { [key in GroupStatus]: StatusIndicatorColor } = {
  [GroupStatus.inPlay]: StatusIndicatorColor.green,
  [GroupStatus.idle]: StatusIndicatorColor.yellow,
  [GroupStatus.drying]: StatusIndicatorColor.orange,
  [GroupStatus.shuttingDown]: StatusIndicatorColor.red,
  [GroupStatus.offline]: StatusIndicatorColor.grey,
};

interface IGroupsStatusProps {
  className?: string
  status: GroupStatus
}

export const GroupsStatus: React.FC<IGroupsStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={groupStatusColorMap[status]}
  >
    { groupStatusLabelMap[status] }
  </StatusIndicator>
));

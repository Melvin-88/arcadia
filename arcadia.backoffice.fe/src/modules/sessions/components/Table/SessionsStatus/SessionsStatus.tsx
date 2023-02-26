import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { sessionsLabelMap } from '../../../constants';
import { SessionStatus } from '../../../types';

export const sessionsColorMap: { [key in SessionStatus]: StatusIndicatorColor } = {
  [SessionStatus.viewer]: StatusIndicatorColor.blue,
  [SessionStatus.playing]: StatusIndicatorColor.green,
  [SessionStatus.autoplay]: StatusIndicatorColor.yellow,
  [SessionStatus.queue]: StatusIndicatorColor.yellow,
  [SessionStatus.terminating]: StatusIndicatorColor.orange,
  [SessionStatus.completed]: StatusIndicatorColor.grey,
  [SessionStatus.terminated]: StatusIndicatorColor.red,
  [SessionStatus.forcedAutoplay]: StatusIndicatorColor.orange,
  [SessionStatus.viewerBetBehind]: StatusIndicatorColor.blue,
  [SessionStatus.queueBetBehind]: StatusIndicatorColor.blue,
  [SessionStatus.reBuy]: StatusIndicatorColor.green,
};

interface ISessionsStatusProps {
  className?: string
  status: SessionStatus
}

export const SessionsStatus: React.FC<ISessionsStatusProps> = ({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={sessionsColorMap[status]}
  >
    { sessionsLabelMap[status] }
  </StatusIndicator>
);

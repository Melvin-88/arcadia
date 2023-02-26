import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { PlayerStatus } from '../../../types';
import { playerStatusLabelMap } from '../../../constants';

export const playStatusColorMap: { [key in PlayerStatus]: StatusIndicatorColor } = {
  [PlayerStatus.active]: StatusIndicatorColor.green,
  [PlayerStatus.inPlay]: StatusIndicatorColor.yellow,
  [PlayerStatus.blocked]: StatusIndicatorColor.red,
};

interface IPlayersStatusProps {
  className?: string
  status: PlayerStatus
}

export const PlayersStatus: React.FC<IPlayersStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={playStatusColorMap[status]}
  >
    { playerStatusLabelMap[status] }
  </StatusIndicator>
));

import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { machineStatusLabelMap } from '../../../constants';
import { MachineStatus } from '../../../types';

export const machineStatusColorMap: { [key in MachineStatus]: StatusIndicatorColor } = {
  [MachineStatus.ready]: StatusIndicatorColor.blue,
  [MachineStatus.inPlay]: StatusIndicatorColor.green,
  [MachineStatus.seeding]: StatusIndicatorColor.yellow,
  [MachineStatus.preparing]: StatusIndicatorColor.yellow,
  [MachineStatus.shuttingDown]: StatusIndicatorColor.red,
  [MachineStatus.stopped]: StatusIndicatorColor.red,
  [MachineStatus.offline]: StatusIndicatorColor.grey,
  [MachineStatus.onHold]: StatusIndicatorColor.orange,
  [MachineStatus.error]: StatusIndicatorColor.red,
};

interface IMachinesStatusProps {
  className?: string
  status: MachineStatus
}

export const MachinesStatus: React.FC<IMachinesStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={machineStatusColorMap[status]}
  >
    { machineStatusLabelMap[status] }
  </StatusIndicator>
));

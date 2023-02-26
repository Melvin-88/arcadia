import React from 'react';
import { StatusIndicator, StatusIndicatorColor } from 'arcadia-common-fe';
import { cameraStatusLabelMap } from '../../../constants';
import { CameraStatus } from '../../../types';

export const cameraStatusColorMap: { [key in CameraStatus]: StatusIndicatorColor } = {
  [CameraStatus.online]: StatusIndicatorColor.green,
  [CameraStatus.offline]: StatusIndicatorColor.red,
  [CameraStatus.unknown]: StatusIndicatorColor.grey,
};

interface ICameraStatusProps {
  className?: string
  status: CameraStatus
}

export const CamerasStatus: React.FC<ICameraStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={cameraStatusColorMap[status]}
  >
    { cameraStatusLabelMap[status] }
  </StatusIndicator>
));

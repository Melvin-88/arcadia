import React from 'react';
import { StatusIndicatorColor, StatusIndicator } from 'arcadia-common-fe';
import { AdministrationUserStatus } from '../../types';
import { administrationStatusLabelMap } from '../../constants';

export const administrationStatusColorMap: { [key in AdministrationUserStatus]: StatusIndicatorColor } = {
  [AdministrationUserStatus.enabled]: StatusIndicatorColor.green,
  [AdministrationUserStatus.disabled]: StatusIndicatorColor.red,
};

interface IAdministrationStatusProps {
  className?: string
  status: AdministrationUserStatus
}

export const AdministrationStatus: React.FC<IAdministrationStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={administrationStatusColorMap[status]}
  >
    { administrationStatusLabelMap[status] }
  </StatusIndicator>
));

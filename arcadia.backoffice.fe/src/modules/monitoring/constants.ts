import { MonitoringAction, MonitoringStatus } from './types';

export const monitoringStatusLabelMap: { [key in MonitoringStatus]: string } = {
  [MonitoringStatus.active]: 'Active',
  [MonitoringStatus.suspended]: 'Suspended',
};

export const monitoringActionLabelMap: { [key in MonitoringAction]: string } = {
  [MonitoringAction.remove]: 'Remove',
};

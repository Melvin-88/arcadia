import { MachineAction, MachineStatus, QueueStatus } from './types';

export const machineStatusLabelMap: { [key in MachineStatus]: string } = {
  [MachineStatus.ready]: 'Ready',
  [MachineStatus.inPlay]: 'In play',
  [MachineStatus.seeding]: 'Seeding',
  [MachineStatus.preparing]: 'Preparing',
  [MachineStatus.shuttingDown]: 'Shutting down',
  [MachineStatus.stopped]: 'Stopped',
  [MachineStatus.offline]: 'Offline',
  [MachineStatus.onHold]: 'On hold',
  [MachineStatus.error]: 'Error',
};

export const queueStatusLabelMap: { [key in QueueStatus]: string } = {
  [QueueStatus.ready]: 'Ready',
  [QueueStatus.inPlay]: 'In play',
  [QueueStatus.drying]: 'Drying',
  [QueueStatus.stopped]: 'Stopped',
};

export const machineActionLabelMap: { [key in MachineAction]: string } = {
  [MachineAction.dry]: 'Dry',
  [MachineAction.shutdown]: 'Shutdown',
  [MachineAction.remove]: 'Remove',
  [MachineAction.reboot]: 'Reboot',
};

import { CameraStatus, CameraAction } from './types';

export const cameraStatusLabelMap: { [key in CameraStatus]: string } = {
  [CameraStatus.online]: 'Online',
  [CameraStatus.offline]: 'Offline',
  [CameraStatus.unknown]: 'Unknown',
};

export const cameraActionLabelMap: { [key in CameraAction]: string } = {
  [CameraAction.remove]: 'Delete',
  [CameraAction.reset]: 'Reset',
};

export const CAMERAS_ON_DISPLAY = 12;

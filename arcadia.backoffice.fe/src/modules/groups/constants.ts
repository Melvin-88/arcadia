import { GroupAction, GroupColorId, GroupStatus } from './types';

export const groupStatusLabelMap: { [key in GroupStatus]: string } = {
  [GroupStatus.inPlay]: 'In play',
  [GroupStatus.idle]: 'Idle',
  [GroupStatus.drying]: 'Drying',
  [GroupStatus.shuttingDown]: 'Shutting down',
  [GroupStatus.offline]: 'Offline',
};

export const groupActionLabelMap: { [key in GroupAction]: string } = {
  [GroupAction.activate]: 'Activate',
  [GroupAction.dry]: 'Dry',
  [GroupAction.shutdown]: 'Shutdown',
  [GroupAction.remove]: 'Remove',
};

export const groupColorIdLabelMap: { [key in GroupColorId]: string } = {
  [GroupColorId.darkBlue]: 'Dark Blue',
  [GroupColorId.lightGreen]: 'Light Green',
  [GroupColorId.mentolGreen]: 'Mentol Green',
  [GroupColorId.orange]: 'Orange',
  [GroupColorId.red]: 'Red',
  [GroupColorId.purple]: 'Purple',
  [GroupColorId.yellow]: 'Yellow',
};

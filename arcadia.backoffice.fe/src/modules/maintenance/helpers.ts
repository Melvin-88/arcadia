import { MaintenanceAction } from './types';

export const getActionText = (actionType: MaintenanceAction) => {
  switch (actionType) {
    case MaintenanceAction.fillDispenser:
      return 'Fill Dispenser';
    case MaintenanceAction.waistEmptied:
      return 'Empty dispenser waist';
    default:
      return 'Dismiss';
  }
};

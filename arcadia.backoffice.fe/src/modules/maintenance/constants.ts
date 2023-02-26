import { MaintenanceAction } from './types';

export const maintenanceActionLabelMap: { [key in MaintenanceAction]: string } = {
  [MaintenanceAction.fillDispenser]: 'Fill Dispenser',
  [MaintenanceAction.waistEmptied]: 'Empty dispenser waist',
  [MaintenanceAction.dismiss]: 'Dismiss',
};

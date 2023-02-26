import { AdministrationAction, AdministrationUserStatus } from './types';

export const administrationStatusLabelMap: { [key in AdministrationUserStatus]: string } = {
  [AdministrationUserStatus.enabled]: 'Enabled',
  [AdministrationUserStatus.disabled]: 'Disabled',
};

export const administrationActionLabelMap: { [key in AdministrationAction]: string } = {
  [AdministrationAction.enable]: 'Enable',
  [AdministrationAction.disable]: 'Disable',
  [AdministrationAction.remove]: 'Remove',
};

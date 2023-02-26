import { OperatorAction, OperatorStatus } from './types';

export const operatorStatusLabelMap: { [key in OperatorStatus]: string } = {
  [OperatorStatus.disabled]: 'Disabled',
  [OperatorStatus.enabled]: 'Enabled',
};

export const operatorActionLabelMap: { [key in OperatorAction]: string } = {
  [OperatorAction.enable]: 'Enable',
  [OperatorAction.disable]: 'Disable',
  [OperatorAction.remove]: 'Remove',
};

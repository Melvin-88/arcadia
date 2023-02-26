import { AlertStatus } from './types';

export const alertStatusLabelMap: { [key in AlertStatus]: string } = {
  [AlertStatus.active]: 'Active',
  [AlertStatus.dismissed]: 'Dismissed',
};

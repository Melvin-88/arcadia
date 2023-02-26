import { IAlertsSlice } from '../types';

export const alertsReducerSelector = ({ alertsReducer }: IAlertsSlice) => alertsReducer;

export const selectedAlertsSelector = ({ alertsReducer }: IAlertsSlice) => alertsReducer.selectedAlerts;

export const alertsDismissDialogSelector = ({ alertsReducer }: IAlertsSlice) => alertsReducer.dismissDialog;

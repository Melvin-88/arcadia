import { createAction } from '@reduxjs/toolkit';
import {
  IGetAlertsRequestFiltersParams, IGetAlertsResponseBody, IAlertsDismissDialogState, AlertId,
} from '../types';

export const getAlerts = createAction<IGetAlertsRequestFiltersParams>('ALERTS/GET_ALERTS');
export const getAlertsSuccess = createAction<IGetAlertsResponseBody>('ALERTS/GET_ALERTS/SUCCESS');
export const getAlertsError = createAction('ALERTS/GET_ALERTS/ERROR');

export const checkAlertsToRefresh = createAction<IGetAlertsRequestFiltersParams>('ALERTS/CHECK_ALERTS_TO_REFRESH');

export const setSelectedAlerts = createAction<AlertId[]>('ALERTS/SET_SELECTED_ALERTS');

export const setDismissDialog = createAction<Partial<IAlertsDismissDialogState> | undefined>('ALERTS/SET_DISMISS_DIALOG');
export const mergeDismissDialog = createAction<Partial<IAlertsDismissDialogState> | undefined>('ALERTS/MERGE_DISMISS_DIALOG');
export const dismissAlerts = createAction<AlertId[]>('ALERTS/DISMISS_ALERTS');

export const flagAlerts = createAction<AlertId[]>('ALERTS/FLAG_ALERTS');

export const exportAlerts = createAction<IGetAlertsRequestFiltersParams>('ALERTS/EXPORT');
export const exportAlertsSuccess = createAction('ALERTS/EXPORT/SUCCESS');
export const exportAlertsError = createAction('ALERTS/EXPORT/ERROR');

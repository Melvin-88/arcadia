import { createAction } from '@reduxjs/toolkit';
import {
  IGetMonitoringRequestFilterParams,
  IGetMonitoringResponseBody,
  IMonitoringDialogFormState,
  IPostMonitoringRequestBody,
  IPutMonitoringRequestBody,
  IMonitoringDialogActionState,
  ISegmentSubsetActionState,
  MonitoringAction,
  IMonitoringActionRequestBody,
} from '../types';

interface IExecuteActionMonitoring extends IMonitoringActionRequestBody {
  action: MonitoringAction
  password: string
}

export const postMonitoring = createAction<IPostMonitoringRequestBody>('MONITORING/POST_MONITORING');

export const getMonitoring = createAction<IGetMonitoringRequestFilterParams>('MONITORING/GET_MONITORING');
export const getMonitoringSuccess = createAction<IGetMonitoringResponseBody>('MONITORING/GET_MONITORING/SUCCESS');
export const getMonitoringError = createAction('MONITORING/GET_MONITORING/ERROR');

export const putMonitoring = createAction<IPutMonitoringRequestBody>('MONITORING/PUT_MONITORING');

export const setMonitoringDialogForm = createAction<Partial<IMonitoringDialogFormState> | undefined>('MONITORING/SET_DIALOG_FORM');
export const mergeMonitoringDialogForm = createAction<Partial<IMonitoringDialogFormState> | undefined>('MONITORING/MERGE_DIALOG_FORM');

export const setMonitoringDialogAction = createAction<Partial<IMonitoringDialogActionState> | undefined>(
  'MONITORING/SET_DIALOG_ACTION',
);
export const mergeMonitoringDialogAction = createAction<Partial<IMonitoringDialogActionState> | undefined>(
  'MONITORING/MERGE_DIALOG_ACTION',
);
export const executeMonitoringAction = createAction<IExecuteActionMonitoring>('MONITORING/EXECUTE_ACTION');

export const exportMonitoring = createAction<IGetMonitoringRequestFilterParams>('MONITORING/EXPORT');
export const exportMonitoringSuccess = createAction('MONITORING/EXPORT/SUCCESS');
export const exportMonitoringError = createAction('MONITORING/EXPORT/ERROR');

export const getSegmentSubset = createAction('MONITORING/GET_SEGMENT_SUBSET');
export const setSegmentSubset = createAction<ISegmentSubsetActionState>('MONITORING/SET_SEGMENT_SUBSET');
export const mergeSegmentSubset = createAction<ISegmentSubsetActionState>('MONITORING/MERGE_SEGMENT_SUBSET');

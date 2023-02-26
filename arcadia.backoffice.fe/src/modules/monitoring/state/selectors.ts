import { IMonitoringSlice } from '../types';

export const monitoringReducerSelector = ({ monitoringReducer }: IMonitoringSlice) => monitoringReducer;

export const monitoringDialogFormSelector = ({ monitoringReducer }: IMonitoringSlice) => monitoringReducer.dialogForm;

export const monitoringDialogActionSelector = ({ monitoringReducer }: IMonitoringSlice) => monitoringReducer.dialogAction;

export const segmentSubsetSelector = ({ monitoringReducer }: IMonitoringSlice) => monitoringReducer.segmentSubset;

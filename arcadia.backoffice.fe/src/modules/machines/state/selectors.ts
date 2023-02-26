import { IMachinesSlice } from '../types';

export const machinesReducerSelector = ({ machinesReducer }: IMachinesSlice) => machinesReducer;

export const machineDialogActionSelector = ({ machinesReducer }: IMachinesSlice) => machinesReducer.dialogAction;

export const machineDialogFormSelector = ({ machinesReducer }: IMachinesSlice) => machinesReducer.dialogForm;

export const machineDialogActivateSelector = ({ machinesReducer }: IMachinesSlice) => machinesReducer.dialogActivate;

export const machineDialogReassignSelector = ({ machinesReducer }: IMachinesSlice) => machinesReducer.dialogReassign;

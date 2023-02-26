import { createAction } from '@reduxjs/toolkit';
import {
  IGetMaintenanceRequestFiltersParams,
  IGetMaintenanceResponseBody,
  IMaintenanceActionRequestBody,
  IMaintenanceDialogActionState,
  IMaintenanceDialogMachineIdentificationState,
  IMachineIdentificationSuccess,
  MaintenanceAction,
  IMaintenanceDialogScanQRCodeState,
} from '../types';

interface IExecuteMaintenanceActionPayload extends IMaintenanceActionRequestBody {
  action: MaintenanceAction
}

export const getMaintenance = createAction<IGetMaintenanceRequestFiltersParams>('MAINTENANCE/GET_MAINTENANCE');
export const getMaintenanceSuccess = createAction<IGetMaintenanceResponseBody>('MAINTENANCE/GET_MAINTENANCE/SUCCESS');
export const getMaintenanceError = createAction('MAINTENANCE/GET_MAINTENANCE/ERROR');

export const exportMaintenance = createAction<IGetMaintenanceRequestFiltersParams>('MAINTENANCE/EXPORT');
export const exportMaintenanceSuccess = createAction('MAINTENANCE/EXPORT/SUCCESS');
export const exportMaintenanceError = createAction('MAINTENANCE/EXPORT/ERROR');

export const setMaintenanceDialogAction = createAction<Partial<IMaintenanceDialogActionState> | undefined>(
  'MAINTENANCE/SET_DIALOG_ACTION',
);
export const mergeMaintenanceDialogAction = createAction<Partial<IMaintenanceDialogActionState> | undefined>(
  'MAINTENANCE/MERGE_DIALOG_ACTION',
);
export const executeMaintenanceAction = createAction<IExecuteMaintenanceActionPayload>('MAINTENANCE/EXECUTE_ACTION');

export const setMaintenanceDialogMachineIdentification = createAction<Partial<IMaintenanceDialogMachineIdentificationState> | undefined>(
  'MAINTENANCE/SET_MACHINE_IDENTIFICATION',
);
export const machineIdentificationSuccess = createAction<IMachineIdentificationSuccess>('MAINTENANCE/MACHINE_IDENTIFICATION_SUCCESS');

export const setMaintenanceDialogQRScan = createAction<IMaintenanceDialogScanQRCodeState | undefined>('MAINTENANCE/SET_DIALOG_QR_SCAN');
export const scanQRCodeSuccess = createAction<{ machineId: number }>('MAINTENANCE/SCAN_QR_CODE_SUCCESS');

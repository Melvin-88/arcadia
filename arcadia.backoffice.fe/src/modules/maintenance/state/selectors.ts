import { IMaintenanceSlice } from '../types';

export const maintenanceReducerSelector = ({ maintenanceReducer }: IMaintenanceSlice) => maintenanceReducer;

export const maintenanceDialogActionSelector = ({ maintenanceReducer }: IMaintenanceSlice) => maintenanceReducer.dialogAction;

export const maintenanceDialogMachineIdentificationSelector = ({ maintenanceReducer }: IMaintenanceSlice) => (
  maintenanceReducer.dialogMachineIdentification
);

export const maintenanceDialogScanQRCodeSelector = ({ maintenanceReducer }: IMaintenanceSlice) => maintenanceReducer.dialogScanQRCode;

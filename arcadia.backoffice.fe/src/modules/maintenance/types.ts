import { ICommonRequestFiltersParams } from 'arcadia-common-fe';
import { AlertType, AlertSeverity } from '../../types/alerts';

export enum MaintenanceAction {
  fillDispenser = 'fillDispenser',
  waistEmptied = 'waistEmptied',
  dismiss = 'dismiss',
}

export type AlertId = number;

export interface AdditionalInfo {
  chipType: string
  dispenserName: string
  machineId: number
  maintenanceRequired: boolean
  maintenanceType: MaintenanceAction
}

export interface IAlert {
  id: AlertId,
  type: AlertType,
  severity: AlertSeverity,
  source: string,
  date: string,
  description: number,
  additionalInfo: AdditionalInfo
}

export type IAlerts = IAlert[];

export interface IMaintenanceFiltersPanelValues {
  type?: AlertType
  severity?: string
  dateFrom?: string
  dateTo?: string
  description?: string
}

export interface IGetMaintenanceRequestFiltersParams extends ICommonRequestFiltersParams, IMaintenanceFiltersPanelValues {
}

export interface IGetMaintenanceResponseBody {
  total: number
  alerts: IAlerts
}

export interface IMaintenanceDialogActionState {
  id?: AlertId
  action: MaintenanceAction
  isOpen: boolean
  isLoading: boolean
}

export interface IMaintenanceDialogMachineIdentificationState {
  id?: AlertId
  action: MaintenanceAction
  isOpen: boolean
}

export interface IMaintenanceDialogScanQRCodeState {
  isOpen: boolean
}

export interface IMachineIdentificationSuccess extends Partial<IMaintenanceDialogActionState> {
}

export interface IMaintenanceReducer extends IGetMaintenanceResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly machineId?: number
  readonly dialogAction: IMaintenanceDialogActionState
  readonly dialogMachineIdentification: IMaintenanceDialogMachineIdentificationState
  readonly dialogScanQRCode: IMaintenanceDialogScanQRCodeState
}

export interface IMaintenanceSlice {
  maintenanceReducer: IMaintenanceReducer
}

export interface IMaintenanceActionRequestBody {
  id: AlertId
}

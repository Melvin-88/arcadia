import { ICommonRequestFiltersParams, INormalizedEntities } from 'arcadia-common-fe';
import { AlertType, AlertSeverity } from '../../types/alerts';

export enum AlertStatus {
  active = 'active',
  dismissed = 'dismissed'
}

export type AlertId = number;

export interface IAlert {
  id: AlertId
  status: AlertStatus
  type: AlertType
  severity: AlertSeverity
  source: string
  date: string
  description: string
  additionalInfo: {}
  isFlagged: boolean
}

export type IAlertsEntities = INormalizedEntities<IAlert, AlertId>;

export type IAlerts = IAlert[];

export interface IAlertsFiltersPanelValues {
  id?: AlertId
  status?: AlertStatus[]
  type?: AlertType[]
  severity?: AlertSeverity[]
  source?: string
  dateFrom?: string
  dateTo?: string
  description?: string
  isFlagged?: boolean
}

export interface IGetAlertsRequestFiltersParams extends ICommonRequestFiltersParams, IAlertsFiltersPanelValues {
}

export interface IGetAlertsResponseBody {
  total: number
  alerts: IAlerts
}

export interface IAlertsDismissRequestBody {
  id: AlertId
}

export interface IFlagAlertRequestBody {
  id: AlertId
}

export interface IAlertsDismissDialogState {
  isOpen: boolean
  isLoading?: boolean
}

export type ISelectedAlerts = AlertId[];

export interface IGetAlertsNormalizedData {
  total: number
  entities: IAlertsEntities
  ids: AlertId[]
}

export interface IAlertsReducer extends IGetAlertsNormalizedData {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly selectedAlerts: ISelectedAlerts
  readonly dismissDialog: IAlertsDismissDialogState
}

export interface IAlertsSlice {
  alertsReducer: IAlertsReducer
}

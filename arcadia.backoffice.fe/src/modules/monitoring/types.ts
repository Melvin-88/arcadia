import { ICommonRequestFiltersParams, ISelectOption } from 'arcadia-common-fe';

export enum MonitoringStatus {
  active = 'active',
  suspended = 'suspended'
}

export enum MonitoringAction {
  remove,
}

export enum Segment {
  machine = 'machine',
  group = 'group',
  operator = 'operator',
  all = 'all',
}

export enum MonitoringMode {
  each = 'each',
  all = 'all',
}

export type MonitoringId = number;

export type ISegmentSubset = {
  group?: number
  machine?: number
  operator?: number
};

export interface IMonitoring {
  id: MonitoringId
  status: MonitoringStatus
  segment: Segment
  segmentSubset: ISegmentSubset
  mode: MonitoringMode
  metric: string
  dimension: string
  targetValue: number
  currentValue: number
  alertLowThreshold: number
  alertHighThreshold: number
  cutoffLowThreshold: number
  cutoffHighThreshold: number
}

export type IMonitoringList = IMonitoring[];

export interface IMonitoringFiltersPanelValues {
  status?: MonitoringStatus
  currentValueTo?: number
  currentValueFrom?: number
  targetValueTo?: number
  targetValueFrom?: number
  dimension?: string
  metric?: string
  mode?: string
  segment?: string
  segmentSubsetGroup?: string[]
  segmentSubsetMachine?: string[]
  segmentSubsetOperator?: string[]
}

export interface IGroupFiltersSubsets {
  segmentSubsetGroup?: string
  segmentSubsetMachine?: string
  segmentSubsetOperator?: string
}

export interface IGetMonitoringRequestFilterParams extends ICommonRequestFiltersParams, IMonitoringFiltersPanelValues {
}

export interface IPutMonitoringRequestBody extends Omit<IMonitoring, 'segmentSubset'> {
  segmentSubset: ISegmentSubset
}

export interface IRemoveMonitoringRequestBody {
  id: MonitoringId
  password: string
}

export interface IPostMonitoringRequestBody extends Omit<IMonitoring, 'segmentSubset'> {
  segmentSubset: ISegmentSubset
}

export interface IMonitoringActionRequestBody {
  id: MonitoringId
}

export interface IGetMonitoringResponseBody {
  total: number
  monitoring: IMonitoringList
}

export interface IMonitoringDialogActionState {
  id: MonitoringId | null
  action: MonitoringAction
  isOpen: boolean
  isLoading?: boolean
}

export interface IMonitoringSegmentSubset {
  isLoading?: boolean
  machines?: ISelectOption[],
  groups?: ISelectOption[],
  operators?: ISelectOption[],
}

export interface ISegmentSubsetActionState extends Partial<IMonitoringSegmentSubset> {
}

export interface IMonitoringDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  initialValues?: Partial<IMonitoring>
}

export interface IMonitoringReducer extends IGetMonitoringResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IMonitoringDialogFormState
  readonly dialogAction: IMonitoringDialogActionState
  readonly segmentSubset: IMonitoringSegmentSubset
}

export interface IMonitoringSlice {
  monitoringReducer: IMonitoringReducer
}

export interface IOperator {
  id: number
  name: string
}

export interface IGetOperatorsResponseBody {
  operators: IOperator[]
}

export interface IGroup {
  id: number
  name: string
}

export interface IGetGroupsResponseBody {
  groups: IGroup[]
}

export interface IMachine {
  id: number
  name: string
}

export interface IGetMachinesResponseBody {
  machines: IMachine[]
}

export enum SelectGroupIdPrefix {
  group = 'group',
  machine = 'machine',
  operator = 'operator',
}

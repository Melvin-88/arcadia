import { ISelectOptions } from 'arcadia-common-fe';

export enum EntityType {
  groupName = 'groupName',
  groupId = 'groupId',
  denominator = 'denominator',
  operatorName = 'operatorName',
  operatorId = 'operatorId',
  machineName = 'machineName',
  location = 'location',
  siteName = 'siteName',
  camerasSiteName = 'camerasSiteName',
  siteId = 'siteId',
  blockingReason = 'blockingReason',
  chipType = 'chipType',
  monitoringMetric = 'monitoringMetric',
  monitoringDimension = 'monitoringDimension',
  rebateCurrency = 'rebateCurrency',
  prizeGroup = 'prizeGroup',
  powerLines = 'powerLines',
}

export interface IEntity {
  options?: ISelectOptions
  isLoading: boolean
}

export type ISelectEntityByTypeReducer = { [key in EntityType]?: IEntity };

export interface ISelectEntityByTypeSlice {
  selectEntityByTypeReducer: ISelectEntityByTypeReducer
}

export interface IGetEntityRequestBody {
  entityType: EntityType
}

export interface IGetLocationResponseBody {
  locations: string[]
}

export interface IGetSitesResponseBody {
  sites: string[]
}

export interface IGetBlockingReasonsResponseBody {
  reasons: string[]
}

export interface IGetDenominatorResponseBody {
  denominators: string[]
}

export interface IChip {
  id: number
  name: string
}

export interface IGetChipTypesResponseBody {
  chipTypes: IChip[]
}

export interface IGetMonitoringMetricsResponseBody {
  metric: string[]
}

export interface IDimension {
  id: number
  name: string
}

export interface IGetMonitoringDimensionResponseBody {
  dimension: IDimension[]
}

export type IGetRebateCurrenciesResponseBody = string[];

export interface IGetPrizeGroupsResponseBody {
  groups: string[]
}

export interface IPowerLine {
  name: string
}

type IPowerLines = IPowerLine[];

export interface IGetPowerLinesResponseBody {
  powerLines: IPowerLines
}

export interface IGroup {
  id: number
  name: string
  denominator: number
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

export interface IOperator {
  id: number
  name: string
}

export interface IGetOperatorsResponseBody {
  operators: IOperator[]
}

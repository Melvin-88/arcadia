import { ISelectOptions } from 'arcadia-common-fe';

export enum EntityType {
  groupName = 'groupName',
}

export interface IEntity {
  options?: ISelectOptions
  isLoading: boolean
}

type ISelectEntityByTypeReducer = { [key in EntityType]: IEntity };

export interface ISelectEntityByTypeSlice {
  selectEntityByTypeReducer: ISelectEntityByTypeReducer
}

export interface IGetEntityRequestBody {
  entityType: EntityType
}

export interface IGroup {
  id: number
  name: string
  denominator: number
}

export interface IGetGroupsResponseBody {
  groups: IGroup[]
}

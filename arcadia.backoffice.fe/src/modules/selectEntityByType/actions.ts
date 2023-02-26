import { createAction } from '@reduxjs/toolkit';
import { ISelectOptions } from 'arcadia-common-fe';
import { EntityType, IGetEntityRequestBody } from './types';

interface IGetEntityDataSuccessActionPayload {
  entityType: EntityType
  options: ISelectOptions
}

export const getEntityData = createAction<IGetEntityRequestBody>('SELECT_ENTITY_BY_TYPE/GET_ENTITY_DATA');
export const getEntityDataSuccess = createAction<IGetEntityDataSuccessActionPayload>('SELECT_ENTITY_BY_TYPE/GET_ENTITY_DATA/SUCCESS');
export const getEntityDataError = createAction<{ entityType: EntityType }>('SELECT_ENTITY_BY_TYPE/GET_ENTITY_DATA/ERROR');

import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import _uniqBy from 'lodash/uniqBy';
import { ISelectOptions } from 'arcadia-common-fe';
import {
  getEntityData, getEntityDataSuccess, getEntityDataError,
} from './actions';
import { handleError } from '../../services/sagasErrorHandler';
import { EntityType, IGroup, IGetEntityRequestBody } from './types';
import { getGroupsRequest } from './api';

function* handleGetEntityDataByType(payload: IGetEntityRequestBody) {
  switch (payload.entityType) {
    case EntityType.groupName: {
      const { data } = yield call(getGroupsRequest);

      return data.groups.map(({ name }: IGroup) => ({ value: name, label: name })) || [];
    }
    default:
      if (process.env.NODE_ENV === 'production') {
        // TODO: Should be reported to the telemetry service
        return [];
      }

      throw new Error(`Oops! GET of the EntityType - ${payload.entityType} was not implemented.`);
  }
}

export function* handleGetEntityData({ payload }: ReturnType<typeof getEntityData>) {
  try {
    const result: ISelectOptions = yield call(handleGetEntityDataByType, payload);
    const uniqueOptions = _uniqBy(result, (option) => option.value);

    yield put(getEntityDataSuccess({ options: uniqueOptions, entityType: payload.entityType }));
  } catch (error) {
    yield put(getEntityDataError({ entityType: payload.entityType }));
    yield handleError(error);
  }
}

export function* selectEntityByTypeSagas() {
  yield all([
    yield takeEvery(
      getEntityData,
      handleGetEntityData,
    ),
  ]);
}

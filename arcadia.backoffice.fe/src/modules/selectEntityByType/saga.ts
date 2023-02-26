import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import _uniqBy from 'lodash/uniqBy';
import { ISelectOptions } from 'arcadia-common-fe';
import {
  getEntityData, getEntityDataSuccess, getEntityDataError,
} from './actions';
import { handleError } from '../../services/sagasErrorHandler';
import {
  EntityType, IGroup, IOperator, IGetEntityRequestBody, IChip, IDimension, IPowerLine,
} from './types';
import {
  getDenominatorRequest,
  getBlockingReasonRequest,
  getGroupsRequest,
  getLocationRequest,
  getMachinesRequest,
  getOperatorsRequest,
  getSitesRequest,
  getChipTypesRequest,
  getMonitoringMetricsRequest,
  getMonitoringDimensionRequest,
  getRebateCurrenciesRequest,
  getCamerasSitesRequest,
  getPrizeGroupsRequest,
  getPowerLinesRequest,
} from './api';
import { IMachine } from '../machines/types';

function* handleGetEntityDataByType(payload: IGetEntityRequestBody) {
  switch (payload.entityType) {
    case EntityType.groupName: {
      const { data } = yield call(getGroupsRequest);

      return data.groups.map(({ name }: IGroup) => ({ value: name, label: name })) || [];
    }
    case EntityType.groupId: {
      const { data } = yield call(getGroupsRequest);

      return data.groups.map(({ name, id }: IGroup) => ({ value: id, label: name })) || [];
    }
    case EntityType.denominator: {
      const { data } = yield call(getDenominatorRequest);

      return data.denominators.map((denominator: string) => ({ value: denominator, label: denominator })) || [];
    }
    case EntityType.operatorName: {
      const { data } = yield call(getOperatorsRequest);

      return data.operators.map(({ name }: IOperator) => ({ value: name, label: name }));
    }
    case EntityType.operatorId: {
      const { data } = yield call(getOperatorsRequest);

      return data.operators.map(({ name, id }: IOperator) => ({ value: id, label: name }));
    }
    case EntityType.machineName: {
      const { data } = yield call(getMachinesRequest);

      return data.machines.map(({ name }: IMachine) => ({ value: name, label: name }));
    }
    case EntityType.location: {
      const { data } = yield call(getLocationRequest);

      return data.locations.map((location: string) => ({ value: location, label: location }));
    }
    case EntityType.siteName: {
      const { data } = yield call(getSitesRequest);

      return data.sites.map(({ name }: IMachine) => ({ value: name, label: name }));
    }
    case EntityType.camerasSiteName: {
      const { data } = yield call(getCamerasSitesRequest);

      return data.sites.map((site: string) => ({ value: site, label: site }));
    }
    case EntityType.siteId: {
      const { data } = yield call(getSitesRequest);

      return data.sites.map(({ name, id }: IMachine) => ({ value: id, label: name }));
    }
    case EntityType.blockingReason: {
      const { data } = yield call(getBlockingReasonRequest);

      return data.blockReasons.map((reason: string) => ({ value: reason, label: reason }));
    }
    case EntityType.chipType: {
      const { data } = yield call(getChipTypesRequest);

      return data.chipTypes.map(({ id, name }: IChip) => ({ value: id, label: name }));
    }
    case EntityType.monitoringMetric: {
      const { data } = yield call(getMonitoringMetricsRequest);

      return data.metric.map((metric: string) => ({ value: metric, label: metric }));
    }
    case EntityType.monitoringDimension: {
      const { data } = yield call(getMonitoringDimensionRequest);

      return data.dimension.map(({ name }: IDimension) => ({ value: name, label: name }));
    }
    case EntityType.rebateCurrency: {
      const { data } = yield call(getRebateCurrenciesRequest);

      return data.map((currency: string) => ({ value: currency, label: currency }));
    }
    case EntityType.prizeGroup: {
      const { data } = yield call(getPrizeGroupsRequest);

      return data.groups.map((group: string) => ({ value: group, label: group }));
    }
    case EntityType.powerLines: {
      const { data } = yield call(getPowerLinesRequest);

      return data.powerLines.map(({ name }: IPowerLine) => ({ value: name, label: name }));
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
    const uniqueOptions = _uniqBy(result, ((option) => option.value));

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

import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import { toast } from 'react-toastify';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { covertBooleanToYesNo, formatDenominator, saveStringAsFile } from 'arcadia-common-fe';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  executeGroupsAction,
  exportGroups,
  exportGroupsError,
  exportGroupsSuccess,
  getGroups,
  getGroupsError,
  getGroupsSuccess,
  mergeGroupsDialogAction,
  mergeGroupsDialogForm,
  postGroup,
  putGroup,
  setGroupsDialogAction,
  setGroupsDialogForm,
} from './actions';
import {
  activateGroupRequest,
  dryGroupRequest,
  getGroupsRequest,
  postGroupRequest,
  putGroupRequest,
  removeGroupRequest,
  shutdownGroupRequest,
} from '../api';
import {
  GroupAction,
  IGetGroupsRequestFiltersParams,
  IGroups,
  IGroupsNormalizedData,
} from '../types';
import { groupStatusLabelMap } from '../constants';

const groupsSchema = new schema.Entity('groups');
const groupsListSchema = new schema.Array(groupsSchema);

function* handleRefreshList() {
  yield put(getGroups(queryString.parse(window.location.search)));
}

function* handleGetGroupsRequest(requestParams: IGetGroupsRequestFiltersParams) {
  const { data } = yield call(getGroupsRequest, requestParams);
  const { result: groupsIds, entities } = normalize<IGroups>(data.groups, groupsListSchema);

  return {
    ids: groupsIds,
    entities: entities.groups,
    total: data.total,
  };
}

function* handlePostGroup({ payload }: ReturnType<typeof postGroup>) {
  try {
    yield put(mergeGroupsDialogForm({
      isLoading: true,
    }));

    yield call(postGroupRequest, payload);
    yield put(setGroupsDialogForm());
    yield call(toast.success, 'The group has been successfully created');
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeGroupsDialogForm({
      isLoading: false,
    }));
  }
}

function* handlePutGroup({ payload }: ReturnType<typeof putGroup>) {
  try {
    yield put(mergeGroupsDialogForm({
      isLoading: true,
    }));

    yield call(putGroupRequest, payload);
    yield put(setGroupsDialogForm());
    yield call(toast.success, `The group ${payload.name} has been successfully updated`);
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeGroupsDialogForm({
      isLoading: false,
    }));
  }
}

function* handleGetGroups({ payload }: ReturnType<typeof getGroups>) {
  try {
    const groupsData: IGroupsNormalizedData = yield handleGetGroupsRequest(payload);

    yield put(getGroupsSuccess(groupsData));
  } catch (error) {
    yield handleError(error);
    yield put(getGroupsError());
  }
}

function* handleExecuteGroupAction({ payload }: ReturnType<typeof executeGroupsAction>) {
  try {
    const { id, action } = payload;

    yield put(mergeGroupsDialogAction({ isLoading: true }));

    switch (action) {
      case GroupAction.activate:
        yield call(activateGroupRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully activated.`);
        break;
      case GroupAction.dry:
        yield call(dryGroupRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully started drying.`);
        break;
      case GroupAction.shutdown:
        yield call(shutdownGroupRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully shutdown.`);
        break;
      case GroupAction.remove:
        yield call(removeGroupRequest, payload);
        yield call(toast.success, `The group with id ${id} has been successfully removed.`);
        break;
      default:
        break;
    }

    yield put(setGroupsDialogAction());
    yield handleRefreshList();
  } catch (error) {
    yield handleError(error);
    yield put(mergeGroupsDialogAction({ isLoading: false }));
  }
}

function* handleExportGroups({ payload }: ReturnType<typeof exportGroups>) {
  try {
    const { ids, entities }: IGroupsNormalizedData = yield handleGetGroupsRequest(payload);

    const preparedData = ids.map((id) => {
      const group = entities[id];

      return ({
        Status: groupStatusLabelMap[group.status],
        'Group ID': id,
        'Group Name': group.name,
        'Total Machines': group.machinesTotal,
        'Idle Machines': group.machinesIdle,
        Denominator: formatDenominator(group.denominator),
        'Has Jackpot': covertBooleanToYesNo(group.hasJackpot),
        Operators: covertBooleanToYesNo(group.operators),
        'Stack size': group.stackCoinsSize,
        'Idle timeout': group.idleTimeout,
        'Grace timeout': group.graceTimeout,
        'Is private': covertBooleanToYesNo(group.isPrivate),
      });
    });

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'groups.csv');
    yield put(exportGroupsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportGroupsError());
  }
}

export function* groupsSagas() {
  yield all([
    yield takeEvery(
      postGroup,
      handlePostGroup,
    ),
    yield takeLatest(
      getGroups,
      handleGetGroups,
    ),
    yield takeEvery(
      putGroup,
      handlePutGroup,
    ),
    yield takeLatest(
      executeGroupsAction,
      handleExecuteGroupAction,
    ),
    yield takeLatest(
      exportGroups,
      handleExportGroups,
    ),
  ]);
}

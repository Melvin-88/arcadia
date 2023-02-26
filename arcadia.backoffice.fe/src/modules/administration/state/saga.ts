import {
  all, call, put, takeEvery, takeLatest, select,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import {
  getDateTimeFormatted,
  saveStringAsFile,
  covertBooleanToYesNo,
  convertDataToJSON,
} from 'arcadia-common-fe';
import {
  executeAdministrationAction,
  exportAdministration,
  exportAdministrationError,
  exportAdministrationSuccess,
  getAdministration,
  getAdministrationError,
  getAdministrationSuccess,
  mergeAdministrationDialogForm,
  postAdministration,
  putAdministration,
  setAdministrationDialogAction,
  setAdministrationDialogForm,
  mergeAdministrationDialogAction,
  administrationEditPassword,
  mergeAdministrationDialogEditPassword,
  setAdministrationDialogEditPassword,
  administrationRegisterChips,
  mergeAdministrationDialogRegisterChips,
  setAdministrationDialogRegisterChips,
  administrationDisqualifyChips,
  mergeAdministrationDialogDisqualifyChips,
  setAdministrationDialogDisqualifyChips,
  administrationFindChip,
  mergeAdministrationDialogFindChip,
  getUserActions,
  mergeAdministrationDialogUserActions,
  exportAdministrationUserActions,
  exportAdministrationUserActionsError,
  exportAdministrationUserActionsSuccess,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import {
  IGetAdministrationRequestFiltersParams,
  IGetAdministrationResponseBody,
  AdministrationAction,
  UserAction,
} from '../types';
import {
  disableUserRequest,
  editPasswordRequest,
  enableUserRequest,
  getAdministrationRequest,
  postAdministrationRequest,
  putAdministrationRequest,
  removeUserRequest,
  findChipRequest,
  registerChipsRequest,
  disqualifyChipsRequest,
  getUserActionsRequest,
} from '../api';
import { administrationStatusLabelMap } from '../constants';
import { permissionsSelector } from '../../auth/selectors';

function* handleGetAdministrationRequest(requestParams: IGetAdministrationRequestFiltersParams) {
  const { data } = yield call(getAdministrationRequest, requestParams);

  return data;
}

function* handleRefreshAdministration() {
  yield put(getAdministration(queryString.parse(window.location.search)));
}

function* handlePostAdministration({ payload }: ReturnType<typeof postAdministration>) {
  try {
    yield put(mergeAdministrationDialogForm({
      isLoading: true,
    }));
    yield call(postAdministrationRequest, payload);
    yield put(setAdministrationDialogForm());
    yield call(toast.success, `The User with email ${payload.email} has been successfully created`);
    yield handleRefreshAdministration();
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogForm({
      isLoading: false,
    }));
  }
}

function* handleGetAdministration({ payload }: ReturnType<typeof getAdministration>) {
  try {
    const administrationData: IGetAdministrationResponseBody = yield handleGetAdministrationRequest(payload);

    yield put(getAdministrationSuccess(administrationData));
  } catch (error) {
    yield handleError(error);
    yield put(getAdministrationError());
  }
}

function* handlePutAdministration({ payload }: ReturnType<typeof putAdministration>) {
  try {
    yield put(mergeAdministrationDialogForm({
      isLoading: true,
    }));
    yield call(putAdministrationRequest, payload);
    yield put(setAdministrationDialogForm());
    yield call(toast.success, `The User with email ${payload.email} has been successfully updated`);
    yield handleRefreshAdministration();
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogForm({
      isLoading: false,
    }));
  }
}

function* handleExecuteAdministrationAction({ payload }: ReturnType<typeof executeAdministrationAction>) {
  try {
    const { id, action } = payload;

    yield put(mergeAdministrationDialogAction({ isLoading: true }));

    switch (action) {
      case AdministrationAction.enable:
        yield call(enableUserRequest, payload);
        yield call(toast.success, `The user with id ${id} has been successfully enabled.`);
        break;
      case AdministrationAction.disable:
        yield call(disableUserRequest, payload);
        yield call(toast.success, `The user with id ${id} has been successfully disabled.`);
        break;
      case AdministrationAction.remove:
        yield call(removeUserRequest, payload);
        yield call(toast.success, `The user with id ${id} has been successfully removed.`);
        break;
      default:
        break;
    }

    yield put(setAdministrationDialogAction());
    yield handleRefreshAdministration();
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogAction({ isLoading: false }));
  }
}

function* handleAdministrationEditPassword({ payload }: ReturnType<typeof administrationEditPassword>) {
  try {
    const { id } = payload;

    yield put(mergeAdministrationDialogEditPassword({ isLoading: true }));

    yield call(editPasswordRequest, payload);
    yield call(toast.success, `The password for the user with ${id} has been successfully edited.`);

    yield put(setAdministrationDialogEditPassword());
    yield handleRefreshAdministration();
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogEditPassword({ isLoading: false }));
  }
}

function* handleAdministrationRegisterChips({ payload }: ReturnType<typeof administrationRegisterChips>) {
  try {
    yield put(mergeAdministrationDialogRegisterChips({ isLoading: true }));

    yield call(registerChipsRequest, payload);
    yield call(toast.success, `Register Chips with DATA - ${JSON.stringify(payload)} has been successfully completed.`);

    yield put(setAdministrationDialogRegisterChips());
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogRegisterChips({ isLoading: false }));
  }
}

function* handleAdministrationDisqualifyChips({ payload }: ReturnType<typeof administrationDisqualifyChips>) {
  try {
    yield put(mergeAdministrationDialogDisqualifyChips({ isLoading: true }));
    yield call(disqualifyChipsRequest, payload);
    yield call(
      toast.success,
      `Chips from RFID - ${payload.fromRFID} to RFID - ${payload.toRFID} have been successfully disqualified`,
    );
    yield put(setAdministrationDialogDisqualifyChips());
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogDisqualifyChips({ isLoading: false }));
  }
}

function* handleAdministrationFindChip({ payload }: ReturnType<typeof administrationFindChip>) {
  try {
    yield put(mergeAdministrationDialogFindChip({ isLoading: true }));

    const { data } = yield call(findChipRequest, payload);

    yield put(mergeAdministrationDialogFindChip({
      isLoading: false,
      ...data,
    }));
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogFindChip({ isLoading: false }));
  }
}

function* handleGetUserActions({ payload }: ReturnType<typeof getUserActions>) {
  try {
    yield put(mergeAdministrationDialogUserActions({ isLoading: true }));

    const { data } = yield call(getUserActionsRequest, payload);

    yield put(mergeAdministrationDialogUserActions({
      isLoading: false,
      filterParams: payload.filterParams,
      ...data,
    }));
  } catch (error) {
    yield handleError(error);
    yield put(mergeAdministrationDialogUserActions({ isLoading: false }));
  }
}

function* handleExportAdministrationUserActions({ payload }: ReturnType<typeof exportAdministrationUserActions>) {
  try {
    const { data } = yield call(getUserActionsRequest, payload);

    const preparedData = data.actions.map((action: UserAction) => ({
      ID: action.id,
      Path: action.path,
      Ip: action.ip,
      Date: getDateTimeFormatted(action.date),
      Action: action.changes.map((item) => item.action),
      'Previous data': action.changes.map((item) => convertDataToJSON(item.previousData)),
      'New Entity data': action.changes.map((item) => convertDataToJSON(item.newData)),
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'user-actions.csv');
    yield put(exportAdministrationUserActionsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportAdministrationUserActionsError());
  }
}

function* handleExportAdministration({ payload }: ReturnType<typeof exportAdministration>) {
  try {
    const { permissionsEntities } = yield select(permissionsSelector);
    const { users }: IGetAdministrationResponseBody = yield handleGetAdministrationRequest(payload);

    const preparedData = users.map((user) => ({
      'User ID': user.id,
      Status: administrationStatusLabelMap[user.status],
      'Is Admin': covertBooleanToYesNo(user.isAdmin),
      'User Name': user.userName,
      'Last Access': getDateTimeFormatted(user.lastAccessDate),
      'Last Access IP': user.lastAccessIp,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Phone 1': user.phone1,
      'Phone 2': user.phone2,
      Email: user.email,
      'Permitted Modules': user.permittedModules?.map((key) => permissionsEntities[key].name).join(', '),
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'administration.csv');
    yield put(exportAdministrationSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportAdministrationError());
  }
}

export function* administrationSagas() {
  yield all([
    yield takeEvery(
      postAdministration,
      handlePostAdministration,
    ),
    yield takeLatest(
      getAdministration,
      handleGetAdministration,
    ),
    yield takeEvery(
      putAdministration,
      handlePutAdministration,
    ),
    yield takeLatest(
      executeAdministrationAction,
      handleExecuteAdministrationAction,
    ),
    yield takeLatest(
      administrationEditPassword,
      handleAdministrationEditPassword,
    ),
    yield takeLatest(
      administrationRegisterChips,
      handleAdministrationRegisterChips,
    ),
    yield takeLatest(
      administrationDisqualifyChips,
      handleAdministrationDisqualifyChips,
    ),
    yield takeLatest(
      administrationFindChip,
      handleAdministrationFindChip,
    ),
    yield takeLatest(
      getUserActions,
      handleGetUserActions,
    ),
    yield takeLatest(
      exportAdministrationUserActions,
      handleExportAdministrationUserActions,
    ),
    yield takeLatest(
      exportAdministration,
      handleExportAdministration,
    ),
  ]);
}

import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import papaparse from 'papaparse';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { history, saveStringAsFile } from 'arcadia-common-fe';
import {
  exportOperators,
  getOperators,
  getOperatorsSuccess,
  getOperatorsError,
  exportOperatorsError,
  exportOperatorsSuccess,
  postOperator,
  mergeOperatorDialogForm,
  setOperatorDialogForm,
  putOperator,
  putOperatorSuccess,
  executeOperatorsAction,
  mergeOperatorsDialogAction,
  setOperatorsDialogAction,
  executeOperatorsActionSuccess,
  uploadOperatorLogo,
  setOperatorLogo,
} from './actions';
import { handleError } from '../../../services/sagasErrorHandler';
import { IGetOperatorsRequestFilterParams, IGetOperatorsResponseBody, OperatorAction } from '../types';
import {
  getOperatorsRequest,
  postOperatorsRequest,
  putOperatorsRequest,
  enableOperatorRequest,
  disableOperatorRequest,
  removeOperatorRequest,
  logoOperatorUploadRequest,
} from '../api';
import { operatorStatusLabelMap } from '../constants';

function* handleGetOperatorsRequest(requestParams: IGetOperatorsRequestFilterParams) {
  const { data } = yield call(getOperatorsRequest, requestParams);

  return data;
}

export function* handleGetOperators({ payload }: ReturnType<typeof getOperators>) {
  try {
    const operatorsData: IGetOperatorsResponseBody = yield handleGetOperatorsRequest(payload);

    yield put(getOperatorsSuccess(operatorsData));
  } catch (error) {
    yield handleError(error);
    yield put(getOperatorsError());
  }
}

function* handlePostOperator({ payload }: ReturnType<typeof postOperator>) {
  try {
    const { location: { search } } = history;

    yield put(mergeOperatorDialogForm({
      isLoading: true,
    }));
    yield call(postOperatorsRequest, payload);
    yield put(setOperatorDialogForm());
    yield call(toast.success, 'The operator has been successfully created');
    yield put(getOperators(queryString.parse(search)));
  } catch (error) {
    yield handleError(error);
    yield put(mergeOperatorDialogForm({
      isLoading: false,
    }));
  }
}

function* handlePutOperator({ payload }: ReturnType<typeof putOperator>) {
  try {
    yield put(mergeOperatorDialogForm({
      isLoading: true,
    }));

    const { data } = yield call(putOperatorsRequest, payload);

    yield put(putOperatorSuccess(data));
    yield put(setOperatorDialogForm());
    yield call(toast.success, `The operator ${payload.name} has been successfully updated`);
  } catch (error) {
    yield handleError(error);
    yield put(mergeOperatorDialogForm({
      isLoading: false,
    }));
  }
}

function* handleExecuteOperatorsAction({ payload }: ReturnType<typeof executeOperatorsAction>) {
  try {
    const { location: { search } } = history;
    const { id, action } = payload;
    let response;

    yield put(mergeOperatorsDialogAction({ isLoading: true }));

    switch (action) {
      case OperatorAction.enable:
        response = yield call(enableOperatorRequest, payload);
        yield call(toast.success, `The operator with id ${id} has been successfully enabled.`);
        break;
      case OperatorAction.disable:
        response = yield call(disableOperatorRequest, payload);
        yield call(toast.success, `The operator with id ${id} has been successfully disabled.`);
        break;
      case OperatorAction.remove:
        response = yield call(removeOperatorRequest, payload);
        yield call(toast.success, `The operator with id ${id} has been successfully removed.`);
        break;
      default:
        break;
    }

    yield put(setOperatorsDialogAction());
    if (action === OperatorAction.remove) {
      yield put(getOperators(queryString.parse(search)));
    } else {
      yield put(executeOperatorsActionSuccess(response.data));
    }
  } catch (error) {
    yield handleError(error);
    yield put(mergeOperatorsDialogAction({ isLoading: false }));
  }
}

function* handleUploadOperatorLogo({ payload }: ReturnType<typeof uploadOperatorLogo>) {
  try {
    const formData: FormData = new FormData();

    formData.append('file', payload, payload?.name);

    const { data } = yield call(logoOperatorUploadRequest, formData);

    yield put(setOperatorLogo(data.url));
  } catch (error) {
    yield handleError(error);
    yield put(mergeOperatorDialogForm({
      isUploadingLogo: false,
    }));
  }
}

function* handleExportOperators({ payload }: ReturnType<typeof exportOperators>) {
  try {
    const { operators }: IGetOperatorsResponseBody = yield handleGetOperatorsRequest(payload);

    const preparedData = operators.map((operator) => ({
      Status: operatorStatusLabelMap[operator.status],
      'Operator ID': operator.id,
      'Operator Name': operator.name,
      'API connector ID': operator.apiConnectorId,
      'API Access token': operator.apiAccessToken,
      'API Access token expiration': operator.apiTokenExpirationDate,
    }));

    const csvString = yield call(papaparse.unparse, preparedData);

    yield call(saveStringAsFile, csvString, 'operators.csv');
    yield put(exportOperatorsSuccess());
  } catch (error) {
    yield handleError(error);
    yield put(exportOperatorsError());
  }
}

export function* operatorsSagas() {
  yield all([
    yield takeLatest(
      getOperators,
      handleGetOperators,
    ),
    yield takeLatest(
      postOperator,
      handlePostOperator,
    ),
    yield takeLatest(
      putOperator,
      handlePutOperator,
    ),
    yield takeLatest(
      executeOperatorsAction,
      handleExecuteOperatorsAction,
    ),
    yield takeLatest(
      uploadOperatorLogo,
      handleUploadOperatorLogo,
    ),
    yield takeLatest(
      exportOperators,
      handleExportOperators,
    ),
  ]);
}

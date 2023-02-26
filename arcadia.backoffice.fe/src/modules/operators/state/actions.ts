import { createAction } from '@reduxjs/toolkit';
import {
  IGetOperatorsRequestFilterParams,
  IGetOperatorsResponseBody,
  IOperatorActionRequestBody,
  IOperatorDialogActionState,
  IOperatorDialogFormState,
  IPostOperatorRequestBody,
  IPutOperatorRequestBody,
  IPutOperatorResponseBody,
  OperatorAction,
  IExecuteOperatorResponseBody,
} from '../types';

interface IExecuteOperatorActionPayload extends IOperatorActionRequestBody {
  action: OperatorAction
}

export const postOperator = createAction<IPostOperatorRequestBody>('OPERATORS/POST_OPERATOR');

export const getOperators = createAction<IGetOperatorsRequestFilterParams>('OPERATORS/GET_OPERATORS');
export const getOperatorsSuccess = createAction<IGetOperatorsResponseBody>('OPERATORS/GET_OPERATORS/SUCCESS');
export const getOperatorsError = createAction('OPERATORS/GET_OPERATORS/ERROR');

export const putOperator = createAction<IPutOperatorRequestBody>('OPERATORS/PUT_OPERATOR');
export const putOperatorSuccess = createAction<IPutOperatorResponseBody>('OPERATORS/PUT_OPERATOR/SUCCESS');

export const setOperatorDialogForm = createAction<Partial<IOperatorDialogFormState> | undefined>('OPERATORS/SET_DIALOG_FORM');
export const mergeOperatorDialogForm = createAction<Partial<IOperatorDialogFormState> | undefined>('OPERATORS/MERGE_DIALOG_FORM');

export const setOperatorsDialogAction = createAction<Partial<IOperatorDialogActionState> | undefined>('OPERATORS/SET_DIALOG_ACTION');
export const mergeOperatorsDialogAction = createAction<Partial<IOperatorDialogActionState> | undefined>('OPERATORS/MERGE_DIALOG_ACTION');
export const executeOperatorsAction = createAction<IExecuteOperatorActionPayload>('OPERATORS/EXECUTE_ACTION');
export const executeOperatorsActionSuccess = createAction<IExecuteOperatorResponseBody>('OPERATORS/EXECUTE_ACTION/SUCCESS');

export const uploadOperatorLogo = createAction<File>('OPERATORS/UPLOAD_LOGO');
export const setOperatorLogo = createAction<string | undefined>('OPERATORS/SET_OPERATOR_LOGO');

export const exportOperators = createAction<IGetOperatorsRequestFilterParams>('OPERATORS/EXPORT');
export const exportOperatorsSuccess = createAction('OPERATORS/EXPORT/SUCCESS');
export const exportOperatorsError = createAction('OPERATORS/EXPORT/ERROR');

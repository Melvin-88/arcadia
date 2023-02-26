import { createReducer } from '@reduxjs/toolkit';
import { IOperatorsReducer, OperatorAction } from '../types';
import {
  getOperators,
  getOperatorsSuccess,
  exportOperatorsError,
  exportOperatorsSuccess,
  exportOperators,
  getOperatorsError,
  setOperatorDialogForm,
  mergeOperatorDialogForm,
  putOperatorSuccess,
  setOperatorsDialogAction,
  mergeOperatorsDialogAction,
  executeOperatorsActionSuccess,
  uploadOperatorLogo,
  setOperatorLogo,
} from './actions';

export const initialState: IOperatorsReducer = {
  isLoading: false,
  isExporting: false,
  total: 0,
  operators: [],
  dialogAction: {
    id: null,
    action: OperatorAction.enable,
    isOpen: false,
    isLoading: false,
  },
  dialogForm: {
    isOpen: false,
    isLoading: false,
    isUploadingLogo: false,
    logoUrl: null,
  },
};

export const operatorsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getOperators, (state) => ({
    ...state,
    total: 0,
    operators: [],
    isLoading: true,
  }));
  builder.addCase(getOperatorsSuccess, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
  }));
  builder.addCase(getOperatorsError, (state) => ({
    ...state,
    isLoading: false,
  }));

  builder.addCase(uploadOperatorLogo, (state) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      isUploadingLogo: true,
    },
  }));

  builder.addCase(exportOperators, (state) => ({
    ...state,
    isExporting: true,
  }));
  builder.addCase(exportOperatorsSuccess, (state) => ({
    ...state,
    isExporting: false,
  }));
  builder.addCase(exportOperatorsError, (state) => ({
    ...state,
    isExporting: false,
  }));

  builder.addCase(setOperatorDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...initialState.dialogForm,
      ...payload,
    },
  }));
  builder.addCase(mergeOperatorDialogForm, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      ...payload,
    },
  }));

  builder.addCase(setOperatorLogo, (state, { payload }) => ({
    ...state,
    dialogForm: {
      ...state.dialogForm,
      isUploadingLogo: false,
      logoUrl: payload,
    },
  }));

  builder.addCase(putOperatorSuccess, (state, { payload }) => ({
    ...state,
    operators: state.operators.map((operator) => {
      if (operator.id !== payload.id) {
        return operator;
      }

      return {
        ...operator,
        ...payload,
      };
    }),
  }));

  builder.addCase(setOperatorsDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...initialState.dialogAction,
      ...payload,
    },
  }));
  builder.addCase(mergeOperatorsDialogAction, (state, { payload }) => ({
    ...state,
    dialogAction: {
      ...state.dialogAction,
      ...payload,
    },
  }));

  builder.addCase(executeOperatorsActionSuccess, (state, { payload }) => ({
    ...state,
    operators: state.operators.map((operator) => {
      if (operator.id !== payload.id) {
        return operator;
      }

      return {
        ...operator,
        ...payload,
      };
    }),
  }));
});

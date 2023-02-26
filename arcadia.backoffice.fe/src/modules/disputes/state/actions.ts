import { createAction } from '@reduxjs/toolkit';
import {
  IDisputesDialogFormState,
  IGetDisputesRequestFiltersParams,
  IGetDisputesResponseBody,
  IPostDisputeRequestBody,
  IPutDisputeRequestBody,
} from '../types';

export const postDispute = createAction<IPostDisputeRequestBody>('DISPUTES/POST_DISPUTE');

export const getDisputes = createAction<IGetDisputesRequestFiltersParams>('DISPUTES/GET_DISPUTES');
export const getDisputesSuccess = createAction<IGetDisputesResponseBody>('DISPUTES/GET_DISPUTES/SUCCESS');
export const getDisputesError = createAction('DISPUTES/GET_DISPUTES/ERROR');

export const putDispute = createAction<IPutDisputeRequestBody>('DISPUTES/PUT_DISPUTE');

export const setDisputeDialogForm = createAction<Partial<IDisputesDialogFormState> | undefined>('DISPUTES/SET_DIALOG_FORM');
export const mergeDisputeDialogForm = createAction<Partial<IDisputesDialogFormState> | undefined>('DISPUTES/MERGE_DIALOG_FORM');

export const exportDisputes = createAction<IGetDisputesRequestFiltersParams>('DISPUTES/EXPORT');
export const exportDisputesSuccess = createAction('DISPUTES/EXPORT/SUCCESS');
export const exportDisputesError = createAction('DISPUTES/EXPORT/ERROR');
